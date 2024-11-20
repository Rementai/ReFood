<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->post('register', 'AuthController::register');
$routes->post('login', 'AuthController::login');
$routes->get('/recipes/top-rated', 'RecipeController::topRated');
$routes->get('/recipes/latest', 'RecipeController::latestRecipes');
$routes->get('/recipes/all', 'RecipeController::index');

