import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React, {ReactElement, useEffect, useState} from "react";
import { index } from "@/actions/App/Http/Controllers/ContinentController";
import {TagOptions} from "@/components/tag-selection";

export type ContinentOption = {
    label: string;
    value: number | string;
    countries_count?: number;
};
interface Props {
    preload?: boolean;
    continents?: ContinentOption[];
    onContinentChange?: (continent: string) => void;
    disabled?: boolean;
    name?: string;
    value?: string;
}

function ContinentLabel(continentOption: ContinentOption): ReactElement {
    let countryCount = null;

    if (continentOption.countries_count) {
        countryCount = (
            <small className="ml-auto">({continentOption.countries_count})</small>
        )
    }

    return (
        <>
            <SelectItem key={continentOption.value} value={String(continentOption.value)}>
                <div className="w-32 flex">
                    {continentOption.label}
                    {countryCount}
                </div>
            </SelectItem>
        </>
    );
}

export default function Continents({continents = [], preload = false, name, disabled = false, onContinentChange, value}: Props) {
    const [continentOptions, setContinentOptions] = useState<ContinentOption[]>(continents);
    const [continent, setContinent] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (preload) {
            fetch(index.url())
                .then((response) => response.json())
                .then((data) => {
                    setContinentOptions(data.continents);
                })
                .catch((error) => {
                    console.error("Error fetching tags:", error);
                    setContinentOptions([]);
                });
        }
    }, [preload]);

    return (
        <Select defaultValue={""} name={name} disabled={disabled} onValueChange={(continent) => {
            onContinentChange?.(continent);
            setContinent(continent);
        }} value={value}>
            <SelectTrigger>
                <SelectValue placeholder="Select a Continent">
                    {continent}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem key={null} value={""}>
                        All
                    </SelectItem>
                    {continentOptions.map((continent) => (
                        (ContinentLabel(continent))
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
