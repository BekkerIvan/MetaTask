import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { index } from '@/actions/App/Http/Controllers/CountryController'
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";

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

interface Country {
    id: number;
    name: string;
    code: string | null;
    capital: string | null;
    continent: string | null;
}

// Matches Continent::query()->orderBy('name')->pluck('name', 'id'):
// a plain object of { [id]: name }, not an array.
type ContinentOptions = Record<string, string>;
type TagOptions = {
    label: string;
    value: number | string;
    color: string;
};

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCountries {
    data: Country[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    countries: PaginatedCountries;
    continents: ContinentOptions;
    tag_options: TagOptions[];
    filters: {
        order: string;
        direction: 'asc' | 'desc';
        search: string;
        continent: string | number | null;
        per_page: number;
        items_per_page: Array<number>;
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

    // Debounce search/filter changes so we don't fire a request on every keystroke.
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, continent, order, direction, perPage, tags]);

    // Cycles a column through asc -> desc -> none, using a dedicated
    // direction field rather than encoding it into the order string.
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

    const tagsComboBox: () => (null | React.JSX.Element) = () => {
        if (! tag_options.length) return null;

        const anchor = useComboboxAnchor()
        return <Combobox
            multiple
            autoHighlight
            items={tag_options}
            onValueChange={(value) => setTags(value)}
        >
            <ComboboxChips ref={anchor} className="w-full max-w-xs bg-neutral-700 shrink-0">
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
    }

    return (
        <>
            <Head title="Countries" />
            <div className="min-h-screen bg-white dark:bg-neutral-800 p-6 text-primary lg:p-10 ">
                <div className="mx-auto max-w-5xl">
                    <h1 className="mb-1 text-xl font-medium">Countries</h1>
                    <p className="mb-6 text-neutral-500 dark:text-neutral-400">
                        {countries.total} {countries.total === 1 ? 'country' : 'countries'}
                    </p>

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                        <Input
                            className=""
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or capital…"
                        />
                        <Select onValueChange={(value) => setContinent(value)} value={continent}>
                            <SelectTrigger className="w-1/5 bg-neutral-700">
                                <SelectValue placeholder="All continents" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="">All continents</SelectItem>
                                    {Object.entries(continents).map(([id, name]) => (
                                        <SelectItem key={name} value={name}>{name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setPerPage(value)} value={perPage}>
                            <SelectTrigger className="bg-neutral-700 w-1/10">
                                <SelectValue placeholder={perPage} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {filters.items_per_page.map((size) => (
                                        <SelectItem key={size} value={size}>{size}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {tagsComboBox()}
                    </div>

                    <DataTable
                        columns={columns}
                        data={countries.data}
                        order={order}
                        direction={direction}
                        onSort={toggleSort}
                    />

                    {countries.last_page > 1 && (
                        <div className="mt-4 flex flex-wrap gap-1">
                            {countries.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    preserveState
                                    preserveScroll
                                    className={`rounded-md px-3 py-1 text-sm ${
                                        link.active
                                            ? 'bg-primary text-white dark:bg-[#EDEDEC] dark:text-primary'
                                            : 'text-[#706f6c] hover:bg-white dark:text-[#A1A09A] dark:hover:bg-[#161615]'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
