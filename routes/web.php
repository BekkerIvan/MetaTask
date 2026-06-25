<?php

use App\Http\Controllers\ContinentController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\TagController;
use App\Models\Country;
use App\Models\Tag;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('countries', [
        'countries_count' => Country::count(),
    ]);
});
Route::get('/tags', function () {
    return Inertia::render('tags', [
        'tags_count' => Tag::count(),
    ]);
});
Route::controller(CountryController::class)
    ->prefix('/countries')
    ->name('countries.')
    ->group(function () {
        Route::get('/list', 'index')->name('index');
        Route::put('/{country}', 'update')->name('update');
        Route::post('', 'store')->name('store');
        Route::delete('/{country}', 'destroy')->name('destroy');
    });
Route::controller(TagController::class)
    ->prefix('/tags')
    ->name('tags.')
    ->group(function () {
        Route::get('/list', 'index')->name('index');
        Route::put('/{tag}', 'update')->name('update');
        Route::post('', 'store')->name('store');
        Route::delete('/{tag}', 'destroy')->name('destroy');
        Route::get('/filter', 'filter')->name('filter');
    });
Route::controller(ContinentController::class)
    ->prefix('/continents')
    ->name('continents.')
    ->group(function () {
        Route::get('', 'index')->name('index');
    });
