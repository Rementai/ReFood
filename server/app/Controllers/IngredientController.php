<?php

namespace App\Controllers;

use App\Models\IngredientModel;
use CodeIgniter\Controller;

class IngredientController extends Controller
{
    public function index()
    {
        $ingredientModel = new IngredientModel();
        $ingredients = $ingredientModel->findAll();

        return $this->response->setJSON($ingredients);
    }

    public function create()
    {
        $ingredientModel = new IngredientModel();
        $data = $this->request->getJSON(true);

        if (!$data || empty($data['name']) || empty($data['unit'])) {
            return $this->response->setJSON(['error' => 'Invalid ingredient data'])->setStatusCode(400);
        }

        $existingIngredient = $ingredientModel->getIngredientByName($data['name']);
        if ($existingIngredient) {
            return $this->response->setJSON(['message' => 'Ingredient already exists', 'ingredient' => $existingIngredient]);
        }

        $ingredientId = $ingredientModel->addIngredient($data['name'], $data['unit']);

        return $this->response->setJSON(['message' => 'Ingredient added successfully', 'ingredient_id' => $ingredientId]);
    }
}
