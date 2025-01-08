<?php

namespace App\Models;

use CodeIgniter\Model;

class RecipeModel extends Model
{
    protected $table = 'recipes';
    protected $primaryKey = 'recipe_id';
    protected $allowedFields = [
        'title', 'description', 'instructions', 
        'prep_time', 'cook_time', 'difficulty', 'image', 
        'user_id', 'average_rating', 'created_at', 'updated_at'
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    
    protected $validationRules = [
        'title' => 'required|min_length[3]|max_length[255]',
        'description' => 'required|min_length[10]',
        'instructions' => 'required|min_length[10]',
        'prep_time' => 'required|integer',
        'cook_time' => 'required|integer',
        'difficulty' => 'required|in_list[easy,medium,hard]',
        'image' => 'permit_empty|valid_url',
    ];

    public function getRecipeWithIngredients($recipeId)
    {
        $builder = $this->db->table('recipes');
        $builder->select('recipes.*, recipe_ingredients.quantity, ingredients.name as ingredient_name, ingredients.unit');
        $builder->join('recipe_ingredients', 'recipes.recipe_id = recipe_ingredients.recipe_id');
        $builder->join('ingredients', 'recipe_ingredients.ingredient_id = ingredients.ingredient_id');
        $builder->where('recipes.recipe_id', $recipeId);
    
        $query = $builder->get();
        return $query->getResultArray();
    }
    

    public function getTopRatedRecipes($limit = 3)
    {
        return $this->orderBy('average_rating', 'desc')
                    ->limit($limit)
                    ->findAll();
    }

    public function getLatestRecipes($limit = 5)
    {
        return $this->orderBy('created_at', 'desc')
                    ->limit($limit)
                    ->findAll();
    }

    public function addRating($recipeId, $userId, $rating)
    {
        $data = [
            'recipe_id' => $recipeId,
            'user_id' => $userId,
            'rating' => $rating,
        ];

        $this->db->table('recipe_ratings')->insert($data);

        $this->updateAverageRating($recipeId);
    }

    public function updateAverageRating($recipeId)
    {
        $query = $this->db->table('recipe_ratings')
                        ->selectAvg('rating', 'average_rating')
                        ->where('recipe_id', $recipeId)
                        ->get();

        $averageRating = $query->getRow()->average_rating;

        $this->update($recipeId, ['average_rating' => $averageRating]);
    }

    public function getUserRating($recipeId, $userId)
    {
        $query = $this->db->table('recipe_ratings')
                        ->select('rating')
                        ->where('recipe_id', $recipeId)
                        ->where('user_id', $userId)
                        ->get();

        return $query->getRow() ? $query->getRow()->rating : null;
    }
}

