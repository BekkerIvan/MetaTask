import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { columns } from '@/components/tags/data-tables/columns';
import DataTable from '@/components/tags/data-tables';
import React from "react";
import {Button} from "@/components/ui/button";
import { GlobeIcon, PlusIcon } from "lucide-react";
import TagDialog from "@/components/tags/dialogs";
import { Tag } from "@/components/tags";

interface Props {
    tags_count?: number;
}

export default function TagSelection({ tags_count = 0 }: Props) {
    const [tag, setTag] = useState<Tag | undefined>(undefined);
    const [tagDialogOpen, setTagDialogOpen] = useState(false);

    const handleRowClick = (row: Tag) => {
        setTag(row);
        setTagDialogOpen(true);
    };
    const handleCreate = () => {
        setTag(undefined);
        setTagDialogOpen(true);
    };
    const handleViewCountries = () => {
        window.location.href = '/';
    };
    const handleDialogClose = () => {
        setTag(undefined);
        setTagDialogOpen(false);
    };
    return (
        <>
            <Head title="TagSelection" />
            <div className="min-h-screen bg-background p-6 lg:p-10">
                <div className="mx-auto max-w-5xl">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h1 className="mb-1 text-xl font-bold text-foreground">Countries</h1>
                            <p className=" text-muted-foreground">
                                {tags_count} {tags_count === 1 ? 'tag' : 'tags'}
                            </p>
                        </div>
                        <div className="flex gap-x-3">
                            <Button onClick={handleCreate}>
                                <PlusIcon />
                                Tag
                            </Button>
                            <Button onClick={handleViewCountries}>
                                <GlobeIcon />
                                Countries
                            </Button>
                        </div>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    onRowClick={handleRowClick}
                />
                <TagDialog
                    tag={tag}
                    open={tagDialogOpen}
                    onClose={handleDialogClose}
                />
            </div>
        </>
    );
}
