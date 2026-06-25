<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Services\ComboboxMappingService;
use App\Validation\TagValidation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Response;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $this->search($request);
        $order = $this->orderBy($request);
        $direction = $this->orderDirection($request);
        $itemsPerPage = $this->itemsPerPage($request);
        $page = $this->page($request);

        $tags = Tag::select(['id', 'name', 'color'])
            ->when(! empty($search), function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $searchWildcard = "%{$search}%";
                    $query->whereLike('name', $searchWildcard)
                        ->orWhereLike('color', $searchWildcard);
                });
            })
            ->orderBy($order, $direction)
            ->paginate($itemsPerPage, page: $page)
            ->through(fn (Tag $tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'color' => $tag->color,
            ]);

        return Response::json([
            'data' => $tags,
        ]);
    }

    public function filter(Request $request)
    {
        $tags = Tag::query()->withCount('countries')->orderBy('name');
        $comboboxMappingService = new ComboboxMappingService;
        return Response::json([
            'tags' => $comboboxMappingService->fromQuery(
                $tags,
                valueKey: 'name',
                extraKeys: [
                    'color',
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
        $data = $request->validate(TagValidation::rules());

        Tag::create($data);

        return Inertia::back();
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
        $data = $request->validate(TagValidation::rules($tag));

        $tag->update($data);

        return Inertia::back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();

        return Inertia::back();
    }
}
