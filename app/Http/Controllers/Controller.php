<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

abstract class Controller
{
    private function query(Request $request, $key, $default = ''): string
    {
        return trim($request->query($key, $default));
    }

    protected function search(Request $request, $default = ''): string
    {
        return $this->query($request, 'search', $default);
    }

    protected function orderBy(Request $request, $default = ''): string
    {
        return $this->query($request, 'order', $default);
    }

    protected function orderDirection(Request $request, $default = 'asc'): string
    {
        return $this->query($request, 'direction', $default);
    }

    protected function itemsPerPage(Request $request, $default = 20): int
    {
        return (int) $this->query($request, 'per_page', $default);
    }

    protected function page(Request $request, $default = 1): int
    {
        return (int) $this->query($request, 'page', $default);
    }
}
