import {Column, Table} from "@tanstack/react-table";
import React from "react";

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
