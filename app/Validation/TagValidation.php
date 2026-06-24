<?php

namespace App\Validation;

use Illuminate\Validation\Rule;
use App\Models\Tag;

abstract class TagValidation
{
    public static function rules(?Tag $tag = null): array
    {
        return [
            'name' => ['string', Rule::unique('tags')->ignore($tag?->id)],
            'color' => 'string',
        ];
    }
}
