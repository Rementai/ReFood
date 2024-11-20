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

    public function show($id)
    {
        $recipeModel = new RecipeModel();
        $recipe = $recipeModel->find($id);
        
        if (!$recipe) {
            
            return $this->response->setJSON(['error' => 'Recipe not found'])->setStatusCode(404);
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
}
