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
$routes->get('/recipes/(:num)', 'RecipeController::show/$1');
$routes->get('/recipes/shopping-list/(:num)', 'RecipeController::generateShoppingList/$1');
$routes->get('/recipes/search', 'RecipeController::search');
$routes->get('/recipes/category/(:num)', 'RecipeController::getRecipesByCategory/$1');

$routes->get('/categories', 'CategoryController::index');

$routes->get('/user/info', 'UserController::getUserInfo');
$routes->post('/user/update-username', 'UserController::updateUsername');
$routes->post('/user/update-password', 'UserController::updatePassword');
