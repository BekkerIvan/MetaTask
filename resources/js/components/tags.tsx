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
import React, {useEffect, useState} from "react";
import { index } from "@/actions/App/Http/Controllers/TagController";


interface Props<T> {
    preload?: boolean;
    tags?: TagOptions[];
    onTagsChange?: (tags: string[]) => void;
    anchorRef?: React.RefObject<T>;
    disabled?: boolean;
    name?: string;
}

export type TagOptions = {
    label: string;
    value: number | string;
    color: string;
};


export default function Tags({ preload = false, onTagsChange, tags = [], anchorRef, disabled = false, name }: Props<HTMLDivElement | null>) {
    const anchor: React.RefObject<HTMLDivElement | null> = anchorRef || useComboboxAnchor();
    const [tagOptions, setTagOptions] = useState<TagOptions[]>(tags);

    useEffect(() => {
        if (preload) {
            fetch(index.url())
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
            modal={true}
        >
            <ComboboxChips ref={anchor} className="shrink-0">
                <ComboboxValue>
                    {(values) => (
                        <React.Fragment>
                            {values.map((value: string) => (
                                <ComboboxChip key={value}>{value}</ComboboxChip>
                            ))}
                            <ComboboxChipsInput placeholder="Tags" />
                        </React.Fragment>
                    )}
                </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent className="">
                <ComboboxEmpty>No Tags found.</ComboboxEmpty>
                <ComboboxInput name={name} showTrigger={false} placeholder="Search Tag" disabled={disabled}/>
                <ComboboxList>
                    {(tagOption: TagOptions) => (
                        <ComboboxItem key={tagOption.value} value={tagOption.value}>
                                <span
                                    className="inline-block w-3 h-3 rounded-full mr-2 shrink-0"
                                    style={{ backgroundColor: tagOption.color }}
                                />
                            {tagOption.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
