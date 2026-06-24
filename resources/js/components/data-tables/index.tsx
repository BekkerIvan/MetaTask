import {Column, Table} from "@tanstack/react-table";
import React from "react";
import {cn} from "@/lib/utils";

export function indeterminateState<TData>(table: Table<TData>): boolean|"indeterminate" {
    return table.getIsAllRowsSelected()
        ? true
        : table.getIsSomeRowsSelected()
            ? "indeterminate"
            : false
}

export function getSortingHeader<TData, TValue>(column: Column<TData, TValue>): React.JSX.Element {
    return <span className="capitalize">{column.id}</span>
}

export function getBasicCell(row: string, className: string = ""): React.JSX.Element {
    return <span className={className}>{row}</span>
}
export function getColorCell(color: string, className: string = ""): React.JSX.Element {
    if (! color) color = "#FFF";
    return <div className={cn("h-6 w-6 rounded-sm",  className)} style={{ backgroundColor: color }}/>
}
