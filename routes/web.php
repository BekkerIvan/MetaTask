<?php

use App\Http\Controllers\ContinentController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\TagController;
use App\Models\Country;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'countries_count' => Country::count(),
    ]);
});
Route::controller(CountryController::class)
    ->prefix('/countries')
    ->name('countries.')
    ->group(function () {
        Route::get('', 'index')->name('index');
        Route::put('/{country}', 'update')->name('update');
        Route::post('/', 'store')->name('store');
        Route::delete('/{country}', 'destroy')->name('destroy');
    });
Route::controller(TagController::class)
    ->prefix('/tags')
    ->name('tags.')
    ->group(function () {
        Route::get('', 'index')->name('index');
        Route::put('/{tag}', 'update')->name('update');
        Route::post('/', 'store')->name('store');
    });
Route::controller(ContinentController::class)
    ->prefix('/continents')
    ->name('continents.')
    ->group(function () {
        Route::get('', 'index')->name('index');
    });
