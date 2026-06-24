import { ColumnDef, HeaderContext, CellContext } from "@tanstack/react-table";
import React from "react";
import {getBasicCell, getColorCell, getSortingHeader} from "@/components/data-tables";
import {Checkbox} from "@/components/ui/checkbox";
import {indeterminateState} from "@/components/data-tables";

import { Tag } from "@/components/tags";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        sortable?: boolean;
    }
}

const muted = "text-[#706f6c] dark:text-[#A1A09A]";

export const columns: ColumnDef<Tag>[] = [
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
        header: ({ column }: HeaderContext<Tag, unknown>): React.JSX.Element => getSortingHeader(column),
        cell: ({ row }: CellContext<Tag, unknown>): React.JSX.Element => getBasicCell(row.original.name, 'font-medium'),
        meta: { sortable: true },
    },
    {
        accessorKey: "color",
        header: ({ column }: HeaderContext<Tag, unknown>): React.JSX.Element => getSortingHeader(column),
        cell: ({ row }): React.JSX.Element => getColorCell(row.original.color, muted),
        meta: { sortable: true },
    },
];
