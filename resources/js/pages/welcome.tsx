import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { index } from '@/actions/App/Http/Controllers/CountryController'
import { Input } from "@/components/ui/input";

import { columns } from '@/components/data-tables/countries/columns';
import { DataTable } from '@/components/data-tables/countries';
import {
    Combobox,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxChip,
    ComboboxChips,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
    ComboboxInput,
} from "@/components/ui/combobox";
import React from "react";
import ContinentSelect, {Continent} from "@/components/continent-select";
import ItemsPerPage from "@/components/items-per-page";
import Pagination, { Link as PaginationLink} from "@/components/pagination";

interface Country {
    id: number;
    name: string;
    code: string | null;
    capital: string | null;
    continent: string | null;
}

type TagOptions = {
    label: string;
    value: number | string;
    color: string;
};

interface PaginatedCountries {
    data: Country[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    countries: PaginatedCountries;
    continents: Continent[];
    tag_options: TagOptions[];
    filters: {
        order?: string;
        direction?: 'asc' | 'desc';
        search?: string;
        continent?: Continent;
        per_page?: number;
        items_per_page?: Array<number>;
        tags: Array<number>;
    };
}

export default function CountriesIndex({ countries, continents, tag_options, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [order, setOrder] = useState(filters.order ?? '');
    const [direction, setDirection] = useState(filters.direction ?? 'asc');
    const [perPage, setPerPage] = useState(filters.per_page ?? 20);
    const [continent, setContinent] = useState(filters.continent ?? '');
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (loading) return;
            setLoading(true);
            router.get(
                index.url(),
                {
                    search: search || undefined,
                    continent: continent || undefined,
                    order: order || undefined,
                    direction: order ? direction : undefined,
                    per_page: perPage || undefined,
                    tags: tags.length ? tags : undefined
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
            setLoading(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, continent, order, direction, perPage, tags]);

    const toggleSort = (column: string) => {
        if (order !== column) {
            setOrder(column);
            setDirection('asc');
            return;
        }
        if (direction === 'asc') {
            setDirection('desc');
            return;
        }
        setOrder('');
        setDirection('asc');
    };

    const tagsComboBox = () => {
        if (!tag_options.length) return null;

        const anchor = useComboboxAnchor()
        return (
            <Combobox
                multiple
                autoHighlight
                items={tag_options}
                onValueChange={(value) => setTags(value)}
            >
                <ComboboxChips ref={anchor} className="w-full max-w-xs shrink-0">
                    <ComboboxValue>
                        {(values) => (
                            <React.Fragment>
                                {values.map((value: string) => (
                                    <ComboboxChip key={value}>{value}</ComboboxChip>
                                ))}
                                <ComboboxChipsInput placeholder="Tags" />
                            </React.Fragment>
                        )}
                    </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent className="w-48 min-w-fit absolute left-0" anchor={anchor}>
                    <ComboboxEmpty>No Tags found.</ComboboxEmpty>
                    <ComboboxInput showTrigger={false} placeholder="Search Tag" />
                    <ComboboxList>
                        {(item: TagOptions) => (
                            <ComboboxItem key={item.value} value={item.value}>
                                <span
                                    className="inline-block w-3 h-3 rounded-full mr-2 shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                {item.label}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        )
    }

    return (
        <>
            <Head title="Countries" />
            <div className="min-h-screen bg-background p-6 lg:p-10">
                <div className="mx-auto max-w-5xl">
                    <h1 className="mb-1 text-xl font-bold text-foreground">Countries</h1>
                    <p className="mb-6 text-muted-foreground">
                        {countries.total} {countries.total === 1 ? 'country' : 'countries'}
                    </p>

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or capital…"
                        />
                        <ContinentSelect continents={continents} continent={continent} onSelect={(value) => setContinent(value)}/>
                        <ItemsPerPage itemsPerPage={filters.items_per_page} value={filters.per_page} setValue={(value) => setPerPage(value)}/>
                        {tagsComboBox()}
                    </div>

                    <DataTable
                        columns={columns}
                        data={countries.data}
                        order={order}
                        direction={direction}
                        onSort={toggleSort}
                    />
                    <Pagination links={countries.links}/>
                </div>
            </div>
        </>
    );
}
