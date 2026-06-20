<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
