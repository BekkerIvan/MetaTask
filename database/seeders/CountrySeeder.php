<?php

namespace Database\Seeders;

use App\Models\Continent;
use App\Models\Country;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = Storage::disk('database')->get('Countries.json');

        if (! Str::isJson($countries)) {
            return;
        }
        $countries = json_decode($countries, true);
        $continents = [];

        foreach ($countries as $country) {
            if ($country['continent'] && ! isset($continents[$country['continent']])) {
                $continent = Continent::create([
                    'name' => $country['continent'],
                ]);
                $continents[$continent->name] = $continent->id;
            }
            $continentId = $country['continent'] ? $continents[$country['continent']] : null;

            Country::firstOrCreate([
                'name' => $country['name'],
            ], [
                'name' => $country['name'],
                'code' => $country['code'],
                'capital' => $country['capital'],
                'continent_id' => $continentId,
            ]);
        }
    }
}
