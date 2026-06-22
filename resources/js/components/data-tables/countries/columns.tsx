// columns.tsx
import { ColumnDef, HeaderContext, CellContext } from "@tanstack/react-table";
import React from "react";
import {getBasicCell, getSortingHeader} from "@/components/data-tables";
import {Checkbox} from "@/components/ui/checkbox";
import {indeterminateState} from "@/components/data-tables";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        sortable?: boolean;
    }
}

export interface Country {
    id: number;
    name: string;
    code: string | null;
    capital: string | null;
    continent: string | null;
}

const muted = "text-[#706f6c] dark:text-[#A1A09A]";

export const columns: ColumnDef<Country>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={indeterminateState(table)}
                onCheckedChange={(checked) =>
                    table.getToggleAllRowsSelectedHandler()({
                        target: { checked: checked === true }
                    })
                }
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onCheckedChange={row.getToggleSelectedHandler()}
            />
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }: HeaderContext<Country, unknown>): React.JSX.Element => getSortingHeader(column),
        cell: ({ row }: CellContext<Country, unknown>): React.JSX.Element => getBasicCell(row.original.name, 'font-medium'),
        meta: { sortable: true },
    },
    {
        accessorKey: "code",
        header: ({ column }: HeaderContext<Country, unknown>): React.JSX.Element => getSortingHeader(column),
        cell: ({ row }): React.JSX.Element => getBasicCell(row.original.code ?? "—", muted),
        meta: { sortable: true },
    },
    {
        accessorKey: "capital",
        header: ({ column }: HeaderContext<Country, unknown>): React.JSX.Element => getSortingHeader(column),
        cell: ({ row }): React.JSX.Element => getBasicCell(row.original.capital ?? "—", muted),
        meta: { sortable: true },
    },
    {
        accessorKey: "continent",
        header: ({ column }: HeaderContext<Country, unknown>): React.JSX.Element => getSortingHeader(column),
        cell: ({ row }): React.JSX.Element => getBasicCell(row.original.continent ?? "—", muted),
        meta: { sortable: false },

    },
];
