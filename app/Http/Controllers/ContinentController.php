<?php

namespace App\Http\Controllers;

use App\Models\Continent;
use App\Services\ComboboxMappingService;
use Illuminate\Http\Request;
use Response;

class ContinentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $comboboxMappingService = new ComboboxMappingService;

        return Response::json([
            'continents' => $comboboxMappingService->fromQuery(
                Continent::query()->withCount('countries')->orderBy('name'),
                valueKey: 'name',
                extraKeys: [
                    'countries_count',
                ]
            ),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Continent $continent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Continent $continent)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Continent $continent)
    {
        //
    }
}
