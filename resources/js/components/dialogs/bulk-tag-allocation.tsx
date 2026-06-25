import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {RowModel} from "@tanstack/react-table";
import {Country} from "@/components/country";
import TagSelection from "@/components/tag-selection";
import FormWrapper from "@/components/form-wrapper";
import {bulk} from "@/routes/tags";
import {useMemo, useState} from "react";

interface Props<TData> {
    open?: boolean;
    onClose: () => void;
    rows: RowModel<TData>
}

export function BulkTagAllocationDialog({ open = false, onClose, rows }: Props<Country>) {
    const [selectedTags, setSelectedTags] = useState<string[]>();

    const formAction = useMemo(() => {
        return bulk({
            query: {
                tags: selectedTags,
                countries: rows.rows.map(row => row.original.id)
            }
        });
    }, [selectedTags, rows.rows]);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
            <DialogContent className="sm:max-w-sm">
                <FormWrapper initialValues={{}} formAction={formAction} className="flex flex-col gap-y-3" onSuccess={() => onClose?.()}>
                    <DialogHeader>
                        <DialogTitle>Bulk allocation to {rows.rows.length} rows</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="tags">Tags</Label>
                            <TagSelection name="tags" preload={true} onTagsChange={(tags) => setSelectedTags(tags)}/>
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <Button type="submit">Save</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </FormWrapper>
            </DialogContent>
        </Dialog>
    );
}
