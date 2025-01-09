<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->get('/', 'Home::index');
$routes->get('/recipes/top-rated', 'RecipeController::topRated');
$routes->get('/recipes/latest', 'RecipeController::latestRecipes');
$routes->get('/recipes/all', 'RecipeController::index');
$routes->get('/recipes/(:num)', 'RecipeController::show/$1');
$routes->get('/recipes/shopping-list/(:num)', 'RecipeController::generateShoppingList/$1');
$routes->get('/recipes/search', 'RecipeController::search');
$routes->get('/recipes/category/(:num)', 'RecipeController::getRecipesByCategory/$1');
$routes->post('recipes/rate', 'RecipeController::rateRecipe');
$routes->get('recipes/rating/(:num)', 'RecipeController::getUserRating/$1');
$routes->get('/categories', 'CategoryController::index');

$routes->post('register', 'AuthController::register');
$routes->post('login', 'AuthController::login');

$routes->group('user', ['namespace' => 'App\Controllers'], function ($routes) {
    $routes->get('info', 'UserController::getUserInfo');
    $routes->post('update-username', 'UserController::updateUsername');
    $routes->post('update-password', 'UserController::updatePassword');
});

$routes->group('favorites', ['namespace' => 'App\Controllers'], function ($routes) {
    $routes->post('add', 'FavoritesController::addFavorite');
    $routes->delete('remove', 'FavoritesController::removeFavorite');
    $routes->get('list', 'FavoritesController::getFavorites');
    $routes->get('count', 'FavoritesController::countFavorites');
});
