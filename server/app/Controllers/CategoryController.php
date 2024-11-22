<?php

namespace App\Controllers;

use App\Models\CategoryModel;
use CodeIgniter\RESTful\ResourceController;

class CategoryController extends ResourceController
{
    public function index()
    {
        $model = new CategoryModel();
        $categories = $model->findAll();

        return $this->response->setJSON($categories);
    }
}
