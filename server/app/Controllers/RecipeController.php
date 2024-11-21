<?php

namespace App\Controllers;

use App\Models\RecipeModel;
use CodeIgniter\Controller;

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

        $data = $this->request->getJSON(true);

        if (!$this->validate($recipeModel->validationRules)) {

            return $this->response->setJSON(['errors' => $this->validator->getErrors()])->setStatusCode(400);
        }

        $data['user_id'] = session()->get('user_id'); 
        $recipeModel->save($data);

        return $this->response->setJSON(['message' => 'Recipe successfully added!'])->setStatusCode(201);
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
    
        // Pobierz dane przepisu
        $recipe = $recipeModel->find($recipeId);
    
        if (!$recipe) {
            return $this->response->setStatusCode(404)->setBody('Recipe not found');
        }
    
        // Pobierz składniki przepisu
        $ingredients = $recipeModel->getRecipeWithIngredients($recipeId);
    
        // Pobierz dodatkowe produkty (bez opisu)
        $builder = $db->table('recipe_items');
        $builder->select('items.name as item_name');
        $builder->join('items', 'recipe_items.item_id = items.items_id');
        $builder->where('recipe_items.recipe_id', $recipeId);
        $items = $builder->get()->getResultArray();
    
        // Pobierz parametr servings (domyślnie 1)
        $servings = $this->request->getGet('servings') ?? 1;
    
        // Przelicz składniki na podstawie liczby porcji
        $scalingFactor = $servings / ($recipe['servings'] ?? 1);
        foreach ($ingredients as &$ingredient) {
            $ingredient['quantity'] = $ingredient['quantity'] * $scalingFactor;
        }
    
        // Generowanie PDF
        $pdf = new \TCPDF();
        $pdf->AddPage();
    
        // Nagłówek
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->Cell(0, 10, 'Shopping List', 0, 1, 'C');
    
        // Dodaj nazwę przepisu
        $pdf->SetFont('helvetica', '', 12);
        $pdf->Ln(5);
        $pdf->Cell(0, 10, 'Recipe: ' . $recipe['title'], 0, 1, 'L');

        // Dodaj liczbę porcji
        $pdf->Ln(5);
        $pdf->Cell(0, 10, 'For ' . $servings . ' servings', 0, 1, 'L');
    
        // Składniki
        $pdf->Ln(10);
        $pdf->Cell(0, 10, 'Ingredients:', 0, 1, 'L');
        foreach ($ingredients as $ingredient) {
            $pdf->Cell(0, 10, '- ' . number_format($ingredient['quantity'], 2) . ' ' . $ingredient['unit'] . ' ' . $ingredient['ingredient_name'], 0, 1, 'L');
        }
    
        // Dodatkowe produkty
        $pdf->Ln(10);
        $pdf->Cell(0, 10, 'Additional Items:', 0, 1, 'L');
        foreach ($items as $item) {
            $pdf->Cell(0, 10, '- ' . $item['item_name'], 0, 1, 'L');
        }
    
        // Wyślij PDF
        $this->response->setHeader('Content-Type', 'application/pdf');
        $pdf->Output('shopping_list.pdf', 'I');
    }
    

}
