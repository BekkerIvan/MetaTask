<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Country extends Model
{
    protected $fillable = [
        'name',
        'code',
        'capital',
        'continent_id',
    ];

    /**
     * The continent this country belongs to.
     */
    public function continent(): BelongsTo
    {
        return $this->belongsTo(Continent::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'country_tag_links');
    }
}
