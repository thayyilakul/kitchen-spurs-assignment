<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RestaurantController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);
Route::apiResource('restaurants', RestaurantController::class);

Route::get('/dashboard/total-restaurants', [DashboardController::class, 'totalRestaurants']);

Route::get('/orders', [OrderController::class, 'index']);
