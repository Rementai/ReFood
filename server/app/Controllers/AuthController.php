<?php

namespace App\Controllers;

use App\Models\UserModel;
use Firebase\JWT\JWT;

class AuthController extends BaseController
{
    public function register()
    {
        $userModel = new UserModel();
        
        $password = $this->request->getVar('password');
        $data = [
            'username' => $this->request->getVar('username'),
            'first_name' => $this->request->getVar('first_name'),
            'last_name' => $this->request->getVar('last_name'),
            'email' => $this->request->getVar('email'),
            'password' => $userModel->hashPassword($password)
        ];
        
        if (!preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&\'()*+,\-.:;<=>?@[\\\\\]^_{|}~]).{8,}$/', $password)) {
            return $this->response->setJSON([
                'error' => 'Password must be at least 8 characters long, contain one uppercase letter, one digit, and one special character.'
            ])->setStatusCode(422);
        }
        
        if (!$userModel->validate($data)) {
            return $this->response->setJSON([
                'errors' => $userModel->errors()
            ])->setStatusCode(422);
        }

        $userModel->save($data);

        return $this->response->setJSON(['message' => 'User registered successfully.']);
    }

    
    public function login()
    {
        $userModel = new UserModel();
        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');
        
        $user = $userModel->where('email', $email)->first();
        
        if ($user && password_verify($password, $user['password'])) {
            $key = env('AUTH_JWT_SECRET', 'default_secret_key');
            
            $payload = [
                'sub' => $user['user_id'],
                'email' => $user['email'],
                'iat' => time(),
                'exp' => time() + 3600
            ];
    
            $jwt = JWT::encode($payload, $key, 'HS256');
    
            return $this->response->setJSON([
                'access_token' => $jwt,
                'message' => 'Login successful'
            ]);
        } else {
            return $this->response->setJSON(['error' => 'Invalid email or password'])->setStatusCode(401);
        }
    }
}