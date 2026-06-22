import { Table } from "@tanstack/react-table";

export function indeterminateState<TData>(table: Table<TData>): boolean|"indeterminate" {
    return table.getIsAllRowsSelected()
        ? true
        : table.getIsSomeRowsSelected()
            ? "indeterminate"
            : false
}
