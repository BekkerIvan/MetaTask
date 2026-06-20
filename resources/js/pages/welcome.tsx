import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Country {
    id: number;
    name: string;
    code: string | null;
    capital: string | null;
    continent: { id: number; name: string } | null;
}

// Matches Continent::query()->orderBy('name')->pluck('name', 'id'):
// a plain object of { [id]: name }, not an array.
type ContinentOptions = Record<string, string>;

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
    filters: {
        search: string;
        continent_id: string | number | null;
    };
}

export default function CountriesIndex({ countries, continents, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [continent, setContinent] = useState(filters.continent_id ?? '');

    // Debounce search/filter changes so we don't fire a request on every keystroke.
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/',
                {
                    search: search || undefined,
                    continent: continent || undefined,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, continent]);

    return (
        <>
            <Head title="Countries" />
            <div className="min-h-screen bg-[#FDFDFC] p-6 text-[#1b1b18] lg:p-10 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <div className="mx-auto max-w-5xl">
                    <h1 className="mb-1 text-xl font-medium">Countries</h1>
                    <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                        {countries.total} {countries.total === 1 ? 'country' : 'countries'}
                    </p>

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or capital…"
                            className="w-full rounded-md border border-[#e3e3e0] bg-white px-3 py-2 text-sm outline-none focus:border-[#f53003] dark:border-[#3E3E3A] dark:bg-[#161615] dark:focus:border-[#FF4433]"
                        />
                        <select
                            value={continent}
                            onChange={(e) => setContinent(e.target.value)}
                            className="w-full rounded-md border border-[#e3e3e0] bg-white px-3 py-2 text-sm outline-none focus:border-[#f53003] sm:w-64 dark:border-[#3E3E3A] dark:bg-[#161615] dark:focus:border-[#FF4433]"
                        >
                            <option value="">All continents</option>
                            {Object.entries(continents).map(([id, name]) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-[#e3e3e0] dark:border-[#3E3E3A]">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white text-xs tracking-wide text-[#706f6c] uppercase dark:bg-[#161615] dark:text-[#A1A09A]">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Code</th>
                                <th className="px-4 py-3 font-medium">Capital</th>
                                <th className="px-4 py-3 font-medium">Continent</th>
                            </tr>
                            </thead>
                            <tbody>
                            {countries.data.map((country) => (
                                <tr
                                    key={country.id}
                                    className="border-t border-[#e3e3e0] bg-white dark:border-[#3E3E3A] dark:bg-[#0a0a0a]"
                                >
                                    <td className="px-4 py-2 font-medium">{country.name}</td>
                                    <td className="px-4 py-2 text-[#706f6c] dark:text-[#A1A09A]">{country.code ?? '—'}</td>
                                    <td className="px-4 py-2 text-[#706f6c] dark:text-[#A1A09A]">{country.capital ?? '—'}</td>
                                    <td className="px-4 py-2 text-[#706f6c] dark:text-[#A1A09A]">
                                        {country.continent?.name ?? '—'}
                                    </td>
                                </tr>
                            ))}
                            {countries.data.length === 0 && (
                                <tr className="bg-white dark:bg-[#0a0a0a]">
                                    <td colSpan={4} className="px-4 py-8 text-center text-[#706f6c] dark:text-[#A1A09A]">
                                        No countries match your search.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

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
                                            ? 'bg-[#1b1b18] text-white dark:bg-[#EDEDEC] dark:text-[#1b1b18]'
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
