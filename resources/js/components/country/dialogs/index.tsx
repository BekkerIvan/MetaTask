import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Country } from "@/components/country";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tags from "@/components/tags";
import { destroy, store, update } from "@/actions/App/Http/Controllers/CountryController";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FormWrapper, { useFormContext } from "@/components/form-wrapper";
import { Errors } from "@inertiajs/core";
import {TrashIcon} from "lucide-react";
import { MouseEventHandler, useEffect, useState } from "react";
import { RouteDefinition } from "@/wayfinder";
import {Continents} from "@/components/continents";
import {ConfirmationDialog} from "@/components/confirmation-dialog";
import {router} from "@inertiajs/react";

function CountryFields({ disabled = false }: { disabled?: boolean }) {
    const form = useFormContext<Country>();
    return (
        <FieldGroup className="my-4">
            <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={form.data.name}
                    onChange={(e) => form.setData("name", e.target.value)}
                    disabled={disabled || form.processing}
                />
                {form.errors.name && (
                    <p className="text-destructive text-sm">{form.errors.name}</p>
                )}
            </Field>
            <Field>
                <Label htmlFor="code">Code</Label>
                <Input
                    id="code"
                    name="code"
                    value={form.data.code}
                    onChange={(e) => form.setData("code", e.target.value)}
                    disabled={disabled || form.processing}
                />
                {form.errors.code && (
                    <p className="text-destructive text-sm">{form.errors.code}</p>
                )}
            </Field>
            <Field>
                <Label htmlFor="capital">Capital</Label>
                <Input
                    id="capital"
                    name="capital"
                    value={form.data.capital}
                    onChange={(e) => form.setData("capital", e.target.value)}
                    disabled={disabled || form.processing}
                />
                {form.errors.capital && (
                    <p className="text-destructive text-sm">{form.errors.capital}</p>
                )}
            </Field>
            <Field>
                <Label htmlFor="continent">Continent</Label>
                <Continents name="continent"
                            preload={true}
                            onContinentChange={(continent: string) => form.setData("continent", continent)}
                            disabled={disabled || form.processing}
                            value={form.data.continent}
                />
                {form.errors.continent && (
                    <p className="text-destructive text-sm">{form.errors.continent}</p>
                )}
            </Field>
            <Field>
                <Label htmlFor="tags">Tags</Label>
                <Tags
                    name="tags"
                    preload={true}
                    tags={form.data.tags}
                    onTagsChange={(tags: string[]) => form.setData("tags", tags)}
                    disabled={disabled || form.processing}
                />
                {form.errors.tags && (
                    <p className="text-destructive text-sm">{form.errors.tags}</p>
                )}
            </Field>
        </FieldGroup>
    );
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const form = useFormContext<Country>();

    return (
        <Button type="submit" disabled={form.processing}>
            {form.processing ? "Saving…" : isEditing ? "Save changes" : "Create"}
        </Button>
    );
}
function DeleteButton({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> | undefined }) {
    if (! onClick) return null;
    const form = useFormContext<Country>();

    return (
        <Button type="button" onClick={onClick} disabled={form.processing} className="mr-auto cursor-pointer" variant="destructive">
            <TrashIcon/>
        </Button>
    );
}



interface Props {
    country?: Country;
    open?: boolean;
    onClose: () => void;
    onSuccess?: (data: Country) => void;
    onError?: (errors: Errors) => void;
}

export function CountryDialog({ country, open = false, onClose, onSuccess, onError }: Props) {
    const isEditing = Boolean(country?.id);

    const [action, setAction] = useState<RouteDefinition<"post" | "put">>(store());
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (isEditing && country?.id) {
            setAction(update({ country: country?.id }))
        } else {
            setAction(store());
        }
    }, [country]);

    const handleDestroy = (): boolean => {
        if (! isEditing) return false;
        if (! country?.id) return false;

        router.delete(destroy({ country: country.id }).url, {
            onSuccess: () => {
                toast.success("Country deleted.");
                onSuccess?.(country);
                onClose?.();
            },
        });
        return true;
    }

    const initialValues: Country = {
        name: country?.name ?? "",
        code: country?.code ?? "",
        capital: country?.capital ?? "",
        continent: country?.continent,
        tags: country?.tags ?? [],
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Country" : "New Country"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Make changes to this country. Click save when you're done."
                            : "Fill in the details for the new country."}
                    </DialogDescription>
                </DialogHeader>

                <FormWrapper
                    initialValues={initialValues}
                    formAction={action}
                    onSuccess={() => {
                        toast.success(isEditing ? "Country updated." : "Country created.");
                        onSuccess?.(country as Country);
                        onClose?.();
                    }}
                    onError={(errors) => {
                        onError?.(errors);
                    }}
                    className="space-y-4"
                >
                    <CountryFields />

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
