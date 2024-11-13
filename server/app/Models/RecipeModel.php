<?php

namespace App\Models;

use CodeIgniter\Model;

class RecipeModel extends Model
{
    protected $table = 'recipes';
    protected $primaryKey = 'id';
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


}

