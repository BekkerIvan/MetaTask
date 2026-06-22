<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            // Geopolitical
            ['name' => 'G20 Member',             'color' => '#4F46E5'],
            ['name' => 'NATO Member',             'color' => '#0EA5E9'],
            ['name' => 'EU Member',               'color' => '#003399'],
            ['name' => 'Commonwealth',            'color' => '#059669'],
            ['name' => 'BRICS',                   'color' => '#DC2626'],
            ['name' => 'Nuclear Power',           'color' => '#7C3AED'],
            // Geography
            ['name' => 'Landlocked',              'color' => '#92400E'],
            ['name' => 'Island Nation',           'color' => '#0891B2'],
            ['name' => 'Tropical',                'color' => '#16A34A'],
            ['name' => 'Arctic / Polar',          'color' => '#BAE6FD'],
            ['name' => 'Desert Nation',           'color' => '#D97706'],
            ['name' => 'Megadiverse',             'color' => '#65A30D'],
            // Economic
            ['name' => 'Developed',               'color' => '#2563EB'],
            ['name' => 'Emerging Market',         'color' => '#F59E0B'],
            // Tourism
            ['name' => 'Top Tourist Destination', 'color' => '#EC4899'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
