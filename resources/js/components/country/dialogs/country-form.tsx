import {Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "@/components/form-wrapper";
import { Country } from "@/components/country";
import Continents from "@/components/continents";
import TagSelection from "@/components/tag-selection";

export default function CountryForm({ disabled = false }: { disabled?: boolean }) {
    const form = useFormContext<Country>();

    if (! form) {
        return null;
    }
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
                <TagSelection
                    name="tags"
                    preload={true}
                    value={form.data.tags}
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
