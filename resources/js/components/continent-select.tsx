import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";
import React from "react";

export type Continent = string;

interface Props {
    continents: Continent[];
    continent?: Continent;
    onSelect?: (continent: Continent) => void
}
export default function ContinentSelect({ continents, continent, onSelect }: Props) {
    return <Select onValueChange={(continent: Continent): void|undefined => onSelect?.(continent) } value={continent}>
        <SelectTrigger className="w-1/5">
            <SelectValue placeholder="All continents" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectItem value="">All continents</SelectItem>
                {continents.map((continent: Continent): React.JSX.Element => (
                    <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
}
