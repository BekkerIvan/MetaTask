<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;

class ComboboxMappingService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Map a collection or query builder result to combobox-friendly arrays.
     *
     * @param  string  $labelKey  Model attribute to use as the label
     * @param  string  $valueKey  Model attribute to use as the value
     * @param  string[]  $extraKeys  Additional model attributes to include
     * @param  string[]|null  $columns  Columns to select when $source is a Builder
     * @return Collection<int, array<string, mixed>>
     */
    public function map(
        Collection|Builder $source,
        string $labelKey = 'name',
        string $valueKey = 'id',
        array $extraKeys = [],
        ?array $columns = null,
    ): Collection {
        if ($source instanceof Builder) {
            $selectColumns = $columns ?? array_unique([$valueKey, $labelKey, ...$extraKeys]);
            $source = $source->get($selectColumns);
        }

        return $source->map(function ($item) use ($labelKey, $valueKey, $extraKeys) {
            $entry = [
                'label' => $item->{$labelKey},
                'value' => $item->{$valueKey},
            ];

            foreach ($extraKeys as $key) {
                $entry[$key] = $item->{$key};
            }

            return $entry;
        });
    }

    /**
     * Convenience method: build directly from a query builder with sane defaults.
     *
     * @param  string[]  $extraKeys
     * @return Collection<int, array<string, mixed>>
     */
    public function fromQuery(
        Builder $query,
        string $labelKey = 'name',
        string $valueKey = 'id',
        array $extraKeys = [],
    ): Collection {
        return $this->map(
            source: $query,
            labelKey: $labelKey,
            valueKey: $valueKey,
            extraKeys: $extraKeys,
        );
    }
}
