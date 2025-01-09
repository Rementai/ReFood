<?php

namespace App\Models;

use CodeIgniter\Model;

class FavoritesModel extends Model
{
    protected $table = 'favorites';
    protected $primaryKey = ['user_id', 'recipe_id'];
    protected $allowedFields = ['user_id', 'recipe_id', 'added_at', 'updated_at'];
    protected $useTimestamps = true;
}
