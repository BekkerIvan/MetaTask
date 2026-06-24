import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import FormWrapper from "@/components/form-wrapper";
import {toast} from "sonner";
import {Tag} from "@/components/tags";
import {Button} from "@/components/ui/button";
import {ConfirmationDialog} from "@/components/confirmation-dialog";
import {useEffect, useState} from "react";
import {RouteDefinition} from "@/wayfinder";
import { store, update, destroy } from "@/actions/App/Http/Controllers/TagController";
import {router} from "@inertiajs/react";
import {Country} from "@/components/country";
import {Errors} from "@inertiajs/core";
import TagForm from "@/components/tags/dialogs/tag-form";
import {DeleteButton, SubmitButton} from "@/components/dialogs";



interface Props {
    tag?: Tag;
    open?: boolean;
    onClose: () => void;
    onSuccess?: (data: Tag) => void;
    onError?: (errors: Errors) => void;
}

export default function TagDialog({ tag, open = false, onClose, onSuccess, onError }: Props) {
    const isEditing = Boolean(tag?.id);

    const [action, setAction] = useState<RouteDefinition<"post" | "put">>(store());
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (isEditing && tag?.id) {
            setAction(update({ tag: tag?.id }))
        } else {
            setAction(store());
        }
    }, [tag]);

    const handleDestroy = (): boolean => {
        if (! isEditing) return false;
        if (! tag?.id) return false;

        router.delete(destroy({ tag: tag.id }).url, {
            onSuccess: () => {
                toast.success("Tag deleted.");
                onSuccess?.(tag);
                onClose?.();
            },
        });
        return true;
    }

    const initialValues: Tag = {
        name: tag?.name ?? "",
        color: tag?.color ?? "",
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Tag" : "New Tag"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Make changes to this tag. Click save when you're done."
                            : "Fill in the details for the new tag."}
                    </DialogDescription>
                </DialogHeader>

                <FormWrapper
                    initialValues={initialValues}
                    formAction={action}
                    onSuccess={() => {
                        toast.success(isEditing ? "Tag updated." : "Tag created.");
                        onSuccess?.(tag);
                        onClose?.();
                    }}
                    onError={(errors) => {
                        onError?.(errors);
                    }}
                    className="space-y-4"
                >
                    <TagForm/>
                    <DialogFooter>
                        {isEditing ? <DeleteButton onClick={() => setConfirmDelete(true)}/> : null}
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </FormWrapper>
            </DialogContent>

            <ConfirmationDialog
                variant="delete"
                open={confirmDelete}
                onOpenChange={setConfirmDelete}
                onConfirm={() => {
                    handleDestroy();
                    setConfirmDelete(false);
                }}
            />
        </Dialog>
    );
}
