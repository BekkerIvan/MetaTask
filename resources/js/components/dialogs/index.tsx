import {MouseEventHandler} from "react";
import { useFormContext } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {TrashIcon} from "lucide-react";

export function SubmitButton<TModel extends object>({ isEditing }: { isEditing: boolean }) {
    const form = useFormContext<TModel>();

    return (
        <Button type="submit" disabled={form?.processing}>
            {form?.processing ? "Saving…" : isEditing ? "Save changes" : "Create"}
        </Button>
    );
}
export function DeleteButton<TModel extends object>({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> | undefined }) {
    if (! onClick) return null;
    const form = useFormContext<TModel>();

    return (
        <Button type="button" onClick={onClick} disabled={form?.processing} className="mr-auto cursor-pointer" variant="destructive">
            <TrashIcon/>
        </Button>
    );
}
