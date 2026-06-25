"use client"

import {
    ChevronDownIcon,EyeIcon, FileStackIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react";

interface Props {
    selectedRows?: number;
    actions: {
        viewRowsSelected: () => void;
        bulkTagAllocation: () => void;
    }
}

export function TableActions({  actions, selectedRows = 0 }: Props) {
    return (
        <ButtonGroup>
            <Button variant="outline" disabled={!selectedRows}>{selectedRows} Rows</Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="pl-2!">
                        <ChevronDownIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={actions.viewRowsSelected}>
                            <EyeIcon />
                            View Selection
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={actions.bulkTagAllocation}>
                            <FileStackIcon />
                            Bulk Tag Allocation
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </ButtonGroup>
    )
}
