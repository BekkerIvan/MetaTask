// data-table.tsx
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    RowSelectionState
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import Continents from "@/components/continents";
import ItemsPerPage from "@/components/items-per-page";
import Tags from "@/components/tags";
import {index} from "@/actions/App/Http/Controllers/CountryController";
import Pagination, { Link as PaginationLink } from "@/components/pagination";
import {Country} from "@/components/country";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    onRowClick?: (row: TData) => void;
}

interface PaginatedData<TData> {
    data: TData[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

export function DataTable<TData, TValue>({ columns, onRowClick }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const [data, setData] = useState<PaginatedData<Country>>({
        data: [],
        links: [],
        current_page: 0,
        last_page: 0,
        total: 0
    });

    const [search, setSearch] = useState<string | undefined>(undefined);
    const [order, setOrder] = useState<string | undefined>(undefined);
    const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
    const [perPage, setPerPage] = useState<string>("20");
    const [continent, setContinent] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);


    const fetchData = async () => {
        setLoading(true);
        const response = await fetch(index.url({
            query: {
                search,
                order,
                direction,
                per_page: perPage,
                continent,
                tags
            }
        }));
        setLoading(false);
        return response;
    }

    useEffect(() => {
        fetchData()
            .then(response => response.json())
            .then(data => setData(data.data))
        return () => {}
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

    const table = useReactTable({
        data: data.data,
        columns,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        }
    });

    return (
        <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or capital…"
                />
                <Continents preload={true} onContinentChange={(value) => setContinent(value)}/>
                <ItemsPerPage setValue={(value: string) => setPerPage(value)}/>
                <Tags preload={true} onTagsChange={(tags: string[]) => setTags(tags)}/>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                    <TableHeader className="bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    const sortable = header.column.columnDef.meta?.sortable;
                                    const isActive = order === header.column.id;

                                    return (
                                        <TableHead key={header.id} className="px-4 py-3 font-medium">
                                            {header.isPlaceholder ? null : sortable ? (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className={`-ml-4 h-8 py-1 hover:bg-transparent hover:text-foreground ${isActive ? 'text-foreground' : ''}`}
                                                    onClick={() => toggleSort(header.column.id)}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    <span className="ml-2 w-3 text-[10px]">
                                                        {isActive ? (direction === "asc" ? "▲" : "▼") : null}
                                                    </span>
                                                </Button>
                                            ) : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    onClick={(event) => {
                                        row.getToggleSelectedHandler();
                                        if (event.target.getAttribute("role") === "checkbox") return;
                                        onRowClick?.(row.original);
                                    }}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="px-4 py-8 text-center text-muted-foreground"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination links={data.links}/>
        </>
    );
}
