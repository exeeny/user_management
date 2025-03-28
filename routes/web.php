<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Middleware\admin;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(admin::class)->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/getUsers', [UserController::class, 'getUsers'])->name('users');
    Route::delete('/deleteUser/{user}', [UserController::class, 'deleteUser']);
    Route::get('/edit/{user}', [UserController::class, 'edit'])->name('user.edit');
    Route::patch('/update/{user}', [UserController::class, 'update'])->name('user.update');
    Route::post('/convertToCsv', [UserController::class, 'exportToCsv']);
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
