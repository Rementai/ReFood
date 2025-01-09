<?php

namespace App\Controllers;

use App\Models\FavoritesModel;
use App\Models\UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class FavoritesController extends BaseController
{
    protected function getUserIdFromToken()
    {
        $authHeader = $this->request->getHeader('Authorization');
        if (!$authHeader) {
            return null;
        }

        $token = explode(' ', $authHeader->getValue())[1];
        $key = env('AUTH_JWT_SECRET', 'default_secret_key');

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            return $decoded->sub;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function addFavorite()
    {
        $userId = $this->getUserIdFromToken();
        if (!$userId) {
            return $this->response->setJSON(['error' => 'Unauthorized'])->setStatusCode(401);
        }

        $recipeId = $this->request->getVar('recipe_id');
        if (!$recipeId) {
            return $this->response->setJSON(['error' => 'Recipe ID is required'])->setStatusCode(400);
        }

        $favoritesModel = new FavoritesModel();
        if ($favoritesModel->where(['user_id' => $userId, 'recipe_id' => $recipeId])->first()) {
            return $this->response->setJSON(['message' => 'Recipe is already in favorites']);
        }

        $favoritesModel->insert([
            'user_id' => $userId,
            'recipe_id' => $recipeId,
        ]);

        return $this->response->setJSON(['message' => 'Recipe added to favorites']);
    }

    public function removeFavorite()
    {
        $userId = $this->getUserIdFromToken();
        if (!$userId) {
            return $this->response->setJSON(['error' => 'Unauthorized'])->setStatusCode(401);
        }

        $recipeId = $this->request->getVar('recipe_id');
        if (!$recipeId) {
            return $this->response->setJSON(['error' => 'Recipe ID is required'])->setStatusCode(400);
        }

        $favoritesModel = new FavoritesModel();
        $favoritesModel->where(['user_id' => $userId, 'recipe_id' => $recipeId])->delete();

        return $this->response->setJSON(['message' => 'Recipe removed from favorites']);
    }

    public function getFavorites()
    {
        $userId = $this->getUserIdFromToken();
        if (!$userId) {
            return $this->response->setJSON(['error' => 'Unauthorized'])->setStatusCode(401);
        }

        $favoritesModel = new FavoritesModel();
        $favorites = $favoritesModel->where('user_id', $userId)->findAll();

        return $this->response->setJSON($favorites);
    }

    public function countFavorites()
    {
        $userId = $this->getUserIdFromToken();
        if (!$userId) {
            return $this->response->setJSON(['error' => 'Unauthorized'])->setStatusCode(401);
        }

        $favoritesModel = new FavoritesModel();
        $count = $favoritesModel->where('user_id', $userId)->countAllResults();

        return $this->response->setJSON(['count' => $count]);
    }
}
