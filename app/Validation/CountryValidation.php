<?php

namespace App\Validation;

use Illuminate\Validation\Rule;
use App\Models\Country;

abstract class CountryValidation
{
    public static function rules(?Country $country = null): array
    {
        return [
            'name' => ['string', Rule::unique('countries')->ignore($country?->id)],
            'code' => 'string',
            'capital' => 'string|nullable',
            'continent' => 'string|exists:continents,name|nullable',
            'tags' => 'array',
            'tags.*' => 'exists:tags',
        ];
    }
}
