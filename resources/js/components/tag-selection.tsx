import {
    Combobox,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxChip,
    ComboboxChips,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
    ComboboxInput,
} from "@/components/ui/combobox";
import React, {ReactElement, useEffect, useState} from "react";
import { filter } from "@/actions/App/Http/Controllers/TagController";


interface Props<T> {
    preload?: boolean;
    tags?: TagOptions[];
    onTagsChange?: (tags: string[]) => void;
    anchorRef?: React.RefObject<T>;
    disabled?: boolean;
    name?: string;
    value?: string[];
}

export type TagOptions = {
    label: string;
    value: number | string;
    color: string;
    countries_count?: number;
};

function TagLabel(tagOption: TagOptions): ReactElement {
    let countryCount = null;

    if (tagOption.countries_count) {
        countryCount = (
            <small className="ml-auto">({tagOption.countries_count})</small>
        )
    }

    return (
        <>
            <span
                className="inline-block w-3 h-3 rounded-full mr-2 shrink-0"
                style={{ backgroundColor: tagOption.color }}
            />
            {tagOption.label}
            {countryCount}
        </>
    );
}

export default function TagSelection({ preload = false, onTagsChange, tags = [], anchorRef, disabled = false, name, value }: Props<HTMLDivElement | null>) {
    const anchor = anchorRef ?? useComboboxAnchor();
    const [tagOptions, setTagOptions] = useState<TagOptions[]>(tags);

    useEffect(() => {
        if (preload) {
            fetch(filter.url())
                .then((response) => response.json())
                .then((data) => {
                    setTagOptions(data.tags);
                })
                .catch((error) => {
                    console.error("Error fetching tags:", error);
                    setTagOptions([]);
                });
        }
    }, [preload]);

    return (
        <Combobox
            multiple
            autoHighlight
            items={tagOptions}
            onValueChange={(tags: string[]) => onTagsChange?.(tags)}
            value={value}
        >
            <ComboboxChips ref={anchor} className="shrink-0 w-60">
                <ComboboxValue>
                    {(selectedValues: string[]) => (
                        <React.Fragment>
                            {selectedValues.map((val) => {
                                return <ComboboxChip key={val}>{val}</ComboboxChip>;
                            })}
                            <ComboboxChipsInput placeholder="TagSelection" />
                        </React.Fragment>
                    )}
                </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No TagSelection found.</ComboboxEmpty>
                <ComboboxInput name={name} showTrigger={false} placeholder="Search Tag" disabled={disabled}/>
                <ComboboxList>
                    {(tagOption: TagOptions) => (
                        <ComboboxItem key={tagOption.value} value={tagOption.value}>
                            {TagLabel(tagOption)}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
