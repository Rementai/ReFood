<?php

namespace App\Controllers;

use App\Models\RecipeModel;
use CodeIgniter\Controller;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\UserModel;

class RecipeController extends Controller
{
    public function index()
    {
        $recipeModel = new RecipeModel();
        $recipes = $recipeModel->findAll();

        return $this->response->setJSON($recipes);
    }

    public function show($recipeId)
    {
        $recipeModel = new RecipeModel();
        $recipeData = $recipeModel->getRecipeWithIngredients($recipeId);

        if (empty($recipeData)) {
            return $this->response->setJSON(['error' => 'Recipe not found'])->setStatusCode(404);
        }

        $recipe = [
            'id' => $recipeData[0]['recipe_id'],
            'title' => $recipeData[0]['title'],
            'description' => $recipeData[0]['description'],
            'instructions' => $recipeData[0]['instructions'],
            'prep_time' => $recipeData[0]['prep_time'],
            'cook_time' => $recipeData[0]['cook_time'],
            'difficulty' => $recipeData[0]['difficulty'],
            'image' => $recipeData[0]['image'],
            'ingredients' => []
        ];

        foreach ($recipeData as $row) {
            $recipe['ingredients'][] = [
                'name' => $row['ingredient_name'],
                'quantity' => $row['quantity'],
                'unit' => $row['unit']
            ];
        }

        return $this->response->setJSON($recipe);
    }

    public function create()
    {
        $recipeModel = new RecipeModel();
        $db = \Config\Database::connect();
        $ingredientModel = $db->table('ingredients');
        $recipeIngredientsModel = $db->table('recipe_ingredients');

        $data = $this->request->getJSON(true);

        if (!$this->validate($recipeModel->validationRules)) {
            return $this->response->setJSON(['errors' => $this->validator->getErrors()])->setStatusCode(400);
        }

        $data['user_id'] = $this->getUserIdFromToken();
        $recipeModel->save($data);
        $recipeId = $recipeModel->getInsertID();

        foreach ($data['ingredients'] as $ingredient) {
            $ingredientRow = $ingredientModel->where('name', $ingredient['name'])->get()->getRow();
            if (!$ingredientRow) {
                $ingredientModel->insert([
                    'name' => $ingredient['name'],
                    'unit' => $ingredient['unit']
                ]);
                $ingredientId = $db->insertID();
            } else {
                $ingredientId = $ingredientRow->ingredient_id;
            }

            $recipeIngredientsModel->insert([
                'recipe_id' => $recipeId,
                'ingredient_id' => $ingredientId,
                'quantity' => $ingredient['quantity']
            ]);
        }

        return $this->response->setJSON(['message' => 'Recipe successfully created!'])->setStatusCode(201);
    }

    public function searchIngredients()
    {
        $query = $this->request->getGet('q');
        $db = \Config\Database::connect();
        $builder = $db->table('ingredients');
        $builder->like('name', $query);
        $result = $builder->get()->getResultArray();

        return $this->response->setJSON($result);
    }

    public function update($id)
    {
        $recipeModel = new RecipeModel();

        $data = $this->request->getJSON(true);

        if (!$this->validate($recipeModel->validationRules)) {

            return $this->response->setJSON(['errors' => $this->validator->getErrors()])->setStatusCode(400);
        }

        $data['id'] = $id;
        $recipeModel->save($data);

        return $this->response->setJSON(['message' => 'Recipe successfully updated!']);
    }

    public function delete($id)
    {
        $recipeModel = new RecipeModel();

        if (!$recipeModel->find($id)) {
            return $this->response->setJSON(['error' => 'Recipe not found'])->setStatusCode(404);
        }

        $recipeModel->delete($id);

        return $this->response->setJSON(['message' => 'Recipe successfully deleted!']);
    }

    public function search()
    {
        $query = $this->request->getGet('q');
        $recipeModel = new RecipeModel();
    
        $recipes = $recipeModel->like('title', $query)->findAll();
    
        return $this->response->setJSON($recipes);
    }
    
    public function topRated()
    {
        $recipeModel = new RecipeModel();
        $topRecipes = $recipeModel->getTopRatedRecipes();

        return $this->response->setJSON($topRecipes);
    }

    public function latestRecipes()
    {
        $recipeModel = new RecipeModel();
        $latestRecipes = $recipeModel->getLatestRecipes();

        return $this->response->setJSON($latestRecipes);
    }

    public function generateShoppingList($recipeId)
    {
        $recipeModel = new RecipeModel();
        $db = \Config\Database::connect();
    
        $recipe = $recipeModel->find($recipeId);
    
        if (!$recipe) {
            return $this->response->setStatusCode(404)->setBody('Recipe not found');
        }
    
        $ingredients = $recipeModel->getRecipeWithIngredients($recipeId);
    
        $builder = $db->table('recipe_items');
        $builder->select('items.name as item_name');
        $builder->join('items', 'recipe_items.item_id = items.items_id');
        $builder->where('recipe_items.recipe_id', $recipeId);
        $items = $builder->get()->getResultArray();
    
        $servings = $this->request->getGet('servings') ?? 1;
    
        $scalingFactor = $servings / ($recipe['servings'] ?? 1);
        foreach ($ingredients as &$ingredient) {
            $ingredient['quantity'] = $ingredient['quantity'] * $scalingFactor;
        }
    
        $pdf = new \TCPDF();
        $pdf->AddPage();
    
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->Cell(0, 10, 'Shopping List', 0, 1, 'C');
    
        $pdf->SetFont('helvetica', '', 12);
        $pdf->Ln(5);
        $pdf->Cell(0, 10, 'Recipe: ' . $recipe['title'], 0, 1, 'L');

        $pdf->Ln(5);
        $pdf->Cell(0, 10, 'For ' . $servings . ' servings', 0, 1, 'L');
    
        $pdf->Ln(10);
        $pdf->Cell(0, 10, 'Ingredients:', 0, 1, 'L');
        foreach ($ingredients as $ingredient) {
            $pdf->Cell(0, 10, '- ' . number_format($ingredient['quantity'], 2) . ' ' . $ingredient['unit'] . ' ' . $ingredient['ingredient_name'], 0, 1, 'L');
        }
    
        $pdf->Ln(10);
        $pdf->Cell(0, 10, 'Additional Items:', 0, 1, 'L');
        foreach ($items as $item) {
            $pdf->Cell(0, 10, '- ' . $item['item_name'], 0, 1, 'L');
        }
    
        $this->response->setHeader('Content-Type', 'application/pdf');
        $pdf->Output('shopping_list.pdf', 'I');
    }
    
    public function getRecipesByCategory($categoryId)
    {
        $recipeModel = new RecipeModel();
        $db = \Config\Database::connect();

        $builder = $db->table('recipes');
        $builder->select('recipes.*');
        $builder->join('recipe_categories', 'recipes.recipe_id = recipe_categories.recipe_id');
        $builder->where('recipe_categories.category_id', $categoryId);

        $query = $builder->get();
        $recipes = $query->getResultArray();

        return $this->response->setJSON($recipes);
    }

    public function getUserIdFromToken()
    {
        $authHeader = $this->request->getHeader('Authorization');
        if (!$authHeader) {
            log_message('error', 'Authorization header missing.');
            return null;
        }
    
        $token = explode(' ', $authHeader->getValue())[1];
        $key = env('AUTH_JWT_SECRET', 'default_secret_key');
    
        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            return $decoded->sub;
        } catch (\Exception $e) {
            log_message('error', 'JWT decoding failed: ' . $e->getMessage());
            return null;
        }
    }

    public function rateRecipe()
    {
        $recipeId = $this->request->getVar('recipe_id');
        $userId = $this->getUserIdFromToken();
        $rating = $this->request->getVar('rating');

        $recipeModel = new \App\Models\RecipeModel();

        if (!$recipeModel->find($recipeId)) {
            return $this->response->setJSON(['error' => 'Recipe not found'])->setStatusCode(404);
        }

        $recipeModel->addRating($recipeId, $userId, $rating);

        return $this->response->setJSON(['message' => 'Rating added successfully']);
    }

    public function getUserRating($recipeId)
    {
        $userId = $this->getUserIdFromToken();
        if (!$userId) {
            return $this->response->setJSON(['error' => 'User not authenticated'])->setStatusCode(401);
        }

        $recipeModel = new \App\Models\RecipeModel();
        $rating = $recipeModel->getUserRating($recipeId, $userId);

        return $this->response->setJSON(['rating' => $rating]);
    }

}
