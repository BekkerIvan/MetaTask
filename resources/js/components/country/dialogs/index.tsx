import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Country } from "@/components/country"
import React, {useEffect, useState} from "react"
import { useForm } from "@inertiajs/react"
import { update } from "@/actions/App/Http/Controllers/CountryController"
import countries from "@/routes/countries";

interface Props {
    country?: Country
}

export function CountryDialog({ country }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: "",
        code: "",
        capital: "",
        continent: "",
    });

    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        if (country) {
            setData({
                name: country.name ?? "",
                code: country.code ?? "",
                capital: country.capital ?? "",
                continent: country.continent ?? "",
            });
            setOpen(true);
        } else {
            reset();
            setOpen(false);
        }
    }, [country])

    function handleClose(): void {
        country = undefined;
        reset();
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!country) return;

        put(update.url({ country: country.id }), {
            preserveScroll: true,
            onSuccess: () => {

            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen: boolean) => {setOpen(isOpen);handleClose()}}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Country</DialogTitle>
                        <DialogDescription>
                            Make changes to this country. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="my-4">
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                        </Field>
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                name="code"
                                value={data.code}
                                onChange={(e) => setData("code", e.target.value)}
                            />
                            {errors.code && <p className="text-destructive text-sm">{errors.code}</p>}
                        </Field>
                        <Field>
                            <Label htmlFor="capital">Capital</Label>
                            <Input
                                id="capital"
                                name="capital"
                                value={data.capital}
                                onChange={(e) => setData("capital", e.target.value)}
                            />
                            {errors.capital && <p className="text-destructive text-sm">{errors.capital}</p>}
                        </Field>
                        <Field>
                            <Label htmlFor="continent">Continent</Label>
                            <Input
                                id="continent"
                                name="continent"
                                value={data.continent}
                                onChange={(e) => setData("continent", e.target.value)}
                                disabled
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Saving…" : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
