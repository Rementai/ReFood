<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    protected $allowedFields = ['username', 'first_name', 'last_name', 'email', 'password', 'created_at', 'last_login'];

    protected $useTimestamps = true;

    protected $validationRules = [
        'username' => 'required|is_unique[users.username]',
        'email' => 'required|valid_email|is_unique[users.email]',
        'password' => 'required|min_length[8]',
        'first_name' => 'required',
        'last_name' => 'required'
    ];

    protected $validationMessages = [
        'username' => [
            'is_unique' => 'This username is already taken. Please choose another one.'
        ],
        'email' => [
            'is_unique' => 'This email address is already registered. Please use another email.'
        ],
    ];

    public function hashPassword($password)
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }
}

