import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React, {useEffect, useState} from "react";
import { index } from "@/actions/App/Http/Controllers/ContinentController";

export type ContinentOption = {
    label: string;
    value: number | string;
};
interface Props {
    preload?: boolean;
    continents?: ContinentOption[];
    onContinentChange?: (continent: string) => void;
    disabled?: boolean;
    name?: string;
    value?: string;
}
export default function Continents({continents = [], preload = false, name, disabled = false, onContinentChange, value}: Props) {
    const [continentOptions, setContinentOptions] = useState<ContinentOption[]>(continents);

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
        <Select name={name} disabled={disabled} onValueChange={(continent) => onContinentChange?.(continent)} value={value}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Continent" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {continentOptions.map((continent) => (
                        <SelectItem key={continent.value} value={String(continent.value)}>
                            {continent.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
