<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CountryController;
Route::controller(CountryController::class)
    ->prefix('/countries')
    ->name('countries.')
    ->group(function () {
        Route::get('', 'index')->name('index');
        Route::put('/{country}', 'update')->name('update');
        Route::post('/{country}', 'store')->name('store');
    });
