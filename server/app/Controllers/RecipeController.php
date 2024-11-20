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

        return view('recipes/index', ['recipes' => $recipes]);
    }

    public function show($id)
    {
        $recipeModel = new RecipeModel();
        $recipe = $recipeModel->find($id);
        
        if (!$recipe) {
            throw new \CodeIgniter\Exceptions\PageNotFoundException('Recipe not found');
        }

        return view('recipes/show', ['recipe' => $recipe]);
    }

    public function create()
    {
        return view('recipes/create');
    }

    public function store()
    {
        $recipeModel = new RecipeModel();
        
        if (!$this->validate($recipeModel->validationRules)) {
            return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
        }

        $data = [
            'title' => $this->request->getPost('title'),
            'description' => $this->request->getPost('description'),
            'instructions' => $this->request->getPost('instructions'),
            'prep_time' => $this->request->getPost('prep_time'),
            'cook_time' => $this->request->getPost('cook_time'),
            'difficulty' => $this->request->getPost('difficulty'),
            'image' => $this->request->getPost('image'),
            'user_id' => session()->get('user_id')
        ];

        $recipeModel->save($data);

        return redirect()->to('/recipes')->with('message', 'Recipe successfully added!');
    }

    public function edit($id)
    {
        $recipeModel = new RecipeModel();
        $recipe = $recipeModel->find($id);

        if (!$recipe) {
            throw new \CodeIgniter\Exceptions\PageNotFoundException('Recipe not found');
        }

        return view('recipes/edit', ['recipe' => $recipe]);
    }

    public function update($id)
    {
        $recipeModel = new RecipeModel();
        
        if (!$this->validate($recipeModel->validationRules)) {
            return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
        }

        $data = [
            'id' => $id,
            'title' => $this->request->getPost('title'),
            'description' => $this->request->getPost('description'),
            'instructions' => $this->request->getPost('instructions'),
            'prep_time' => $this->request->getPost('prep_time'),
            'cook_time' => $this->request->getPost('cook_time'),
            'difficulty' => $this->request->getPost('difficulty'),
            'image' => $this->request->getPost('image')
        ];

        $recipeModel->save($data);

        return redirect()->to('/recipes')->with('message', 'Recipe successfully updated!');
    }

    public function delete($id)
    {
        $recipeModel = new RecipeModel();
        $recipeModel->delete($id);

        return redirect()->to('/recipes')->with('message', 'Recipe successfully deleted!');
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
