<?php

namespace App\Models;

use CodeIgniter\Model;

class IngredientModel extends Model
{
    protected $table = 'ingredients';
    protected $primaryKey = 'ingredient_id';
    protected $allowedFields = ['name', 'unit'];

    public function getIngredientByName($name)
    {
        return $this->where('name', $name)->first();
    }

    public function addIngredient($name, $unit)
    {
        $this->insert([
            'name' => $name,
            'unit' => $unit
        ]);

        return $this->getInsertID();
    }
}
