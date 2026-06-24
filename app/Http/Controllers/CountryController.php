<?php

namespace App\Http\Controllers;

use App\Models\Continent;
use App\Models\Country;
use App\Validation\CountryValidation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Response;

class CountryController extends Controller
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
        $continent = $request->query('continent');
        $tags = $request->query('tags');
        $page = $this->page($request);

        $countries = Country::select(['id', 'name', 'code', 'capital', 'continent_id'])
            ->with('continent:id,name')
            ->with('tags:name')
            ->when(! empty($search), function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $searchWildcard = "%{$search}%";
                    $query->whereLike('name', $searchWildcard)
                        ->orWhereLike('capital', $searchWildcard)
                        ->orWhereHas('continent', function ($query) use ($searchWildcard) {
                            $query->whereLike('name', $searchWildcard);
                        })
                        ->orWhereHas('tags', function ($query) use ($searchWildcard) {
                            $query->whereLike('name', $searchWildcard);
                        });
                });
            })
            ->when($continent, function ($query) use ($continent) {
                $query->whereRelation('continent', 'name', $continent);
            })
            ->when($tags, function ($query) use ($tags) {
                $query->whereHas('tags', function ($query) use ($tags) {
                    $query->whereIn('name', $tags);
                });
            })
            ->orderBy($order, $direction)
            ->paginate($itemsPerPage, page: $page)
            ->through(fn (Country $country) => [
                'id' => $country->id,
                'name' => $country->name,
                'code' => $country->code,
                'capital' => $country->capital,
                'continent' => $country->continent?->name,
                'tags' => $country->tags?->pluck('name'),
            ]);

        return Response::json([
            'data' => $countries,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate(CountryValidation::rules());

        $data['continent_id'] = Continent::where('name', $data['continent'])->value('id');
        unset($data['continent']);

        Country::create($data);

        return Inertia::back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Country $country)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Country $country)
    {
        $data = $request->validate(CountryValidation::rules($country));

        $data['continent_id'] = Continent::where('name', $data['continent'])->value('id');
        unset($data['continent']);

        $country->update($data);

        return Inertia::back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Country $country)
    {
        $country->delete();

        return Inertia::back();
    }
}
