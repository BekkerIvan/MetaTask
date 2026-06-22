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
import React, { useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    order?: string;
    direction?: "asc" | "desc";
    onSort?: (columnId: string) => void;
}

export function DataTable<TData, TValue>({ columns, data, order, direction, onSort }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    return (
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
                                                onClick={() => onSort?.(header.column.id)}
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
                                onClick={row.getToggleSelectedHandler()}
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
    );
}
