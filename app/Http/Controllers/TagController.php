<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Services\ComboboxMappingService;
use Illuminate\Http\Request;
use Response;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comboboxMappingService = new ComboboxMappingService;
        return Response::json([
            'tags' => $comboboxMappingService->fromQuery(
                Tag::query()->orderBy('name'),
                valueKey: 'name',
                extraKeys: ['color'],
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
    public function show(Tag $tag)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        //
    }
}
