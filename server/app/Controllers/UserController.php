<?php

namespace App\Controllers;

use App\Models\UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UserController extends BaseController
{
    public function getUserInfo()
    {
        $authHeader = $this->request->getHeader('Authorization');
        if (!$authHeader) {
            return $this->response->setJSON(['error' => 'Authorization header missing'])->setStatusCode(401);
        }

        $token = explode(' ', $authHeader->getValue())[1];
        $key = env('AUTH_JWT_SECRET', 'default_secret_key');
        
        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->sub;

            $userModel = new UserModel();
            $user = $userModel->find($userId);

            if (!$user) {
                return $this->response->setJSON(['error' => 'User not found'])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'username' => $user['username']
            ]);
        } catch (\Exception $e) {
            return $this->response->setJSON(['error' => 'Invalid token'])->setStatusCode(401);
        }
    }

    public function updateUsername()
    {
        $authHeader = $this->request->getHeader('Authorization');
        if (!$authHeader) {
            return $this->response->setJSON(['error' => 'Authorization header missing'])->setStatusCode(401);
        }

        $token = explode(' ', $authHeader->getValue())[1];
        $key = env('AUTH_JWT_SECRET', 'default_secret_key');

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->sub;

            $newUsername = $this->request->getVar('username');
            $userModel = new UserModel();

            if ($userModel->where('username', $newUsername)->first()) {
                return $this->response->setJSON(['error' => 'This username is already taken.'])->setStatusCode(422);
            }

            $userModel->update($userId, ['username' => $newUsername]);

            return $this->response->setJSON(['message' => 'Username updated successfully.']);
        } catch (\Exception $e) {
            return $this->response->setJSON(['error' => 'Invalid token'])->setStatusCode(401);
        }
    }

    public function updatePassword()
    {
        $authHeader = $this->request->getHeader('Authorization');
        if (!$authHeader) {
            return $this->response->setJSON(['error' => 'Authorization header missing'])->setStatusCode(401);
        }

        $token = explode(' ', $authHeader->getValue())[1];
        $key = env('AUTH_JWT_SECRET', 'default_secret_key');

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->sub;

            $newPassword = $this->request->getVar('password');
            $repeatPassword = $this->request->getVar('repeat_password');

            if ($newPassword !== $repeatPassword) {
                return $this->response->setJSON(['error' => 'Passwords do not match'])->setStatusCode(422);
            }

            if (!preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&\'()*+,\-.:;<=>?@[\\\\\]^_{|}~]).{8,}$/', $newPassword)) {
                return $this->response->setJSON([
                    'error' => 'Password must be at least 8 characters long, contain one uppercase letter, one digit, and one special character.'
                ])->setStatusCode(422);
            }

            $userModel = new UserModel();
            $user = $userModel->find($userId);

            if (!$user) {
                return $this->response->setJSON(['error' => 'User not found'])->setStatusCode(404);
            }

            if (password_verify($newPassword, $user['password'])) {
                return $this->response->setJSON(['error' => 'New password cannot be the same as the current password.'])->setStatusCode(422);
            }

            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            $userModel->update($userId, ['password' => $hashedPassword]);

            return $this->response->setJSON(['message' => 'Password updated successfully.']);
        } catch (\Exception $e) {
            return $this->response->setJSON(['error' => 'Invalid token'])->setStatusCode(401);
        }
    }
}
