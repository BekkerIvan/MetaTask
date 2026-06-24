import {Head, router} from '@inertiajs/react';
import { useState } from 'react';
import { columns } from '@/components/country/data-tables/columns';
import { DataTable } from '@/components/country/data-tables';
import React from "react";
import { Country } from "@/components/country";
import { CountryDialog } from "@/components/country/dialogs";
import {Button} from "@/components/ui/button";
import { PlusIcon, TagsIcon } from "lucide-react";

interface Props {
    countries_count?: number;
}

export default function CountriesIndex({ countries_count = 0 }: Props) {
    const [country, setCountry] = useState<Country | undefined>(undefined);
    const [countryDialogOpen, setCountryDialogOpen] = useState(false);

    const handleRowClick = (row: Country) => {
        setCountry(row);
        setCountryDialogOpen(true);
    };
    const handleCreate = () => {
        setCountry(undefined);
        setCountryDialogOpen(true);
    };
    const handleViewTags = () => {
        window.location.href = '/tags';
    };
    const handleDialogClose = () => {
        setCountryDialogOpen(false);
        setCountry(undefined);
    };

    return (
        <>
            <Head title="Countries" />
            <div className="min-h-screen bg-background p-6 lg:p-10">
                <div className="mx-auto max-w-5xl">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h1 className="mb-1 text-xl font-bold text-foreground">Countries</h1>
                            <p className=" text-muted-foreground">
                                {countries_count} {countries_count === 1 ? 'country' : 'countries'}
                            </p>
                        </div>
                        <div className="flex gap-x-3">
                            <Button onClick={handleCreate}>
                                <PlusIcon />
                                Country
                            </Button>
                            <Button onClick={handleViewTags}>
                                <TagsIcon />
                                Tags
                            </Button>
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        onRowClick={handleRowClick}
                    />
                    <CountryDialog
                        country={country}
                        open={countryDialogOpen}
                        onClose={handleDialogClose}
                    />
                </div>
            </div>
        </>
    );
}
