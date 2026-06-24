import {Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "@/components/form-wrapper";
import {Tag} from "@/components/tags";

export default function TagForm({ disabled = false }: { disabled?: boolean }) {
    const { setData, data, errors, processing } = useFormContext<Tag>();
    return (
        <FieldGroup className="my-4">
            <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={data?.name}
                    onChange={(e) => setData("name", e.target.value)}
                    disabled={disabled || processing}
                />
                {errors.name && (
                    <p className="text-destructive text-sm">{errors.name}</p>
                )}
            </Field>
            <Field>
                <Label htmlFor="color">Code</Label>
                <Input
                    id="code"
                    name="code"
                    type="color"
                    value={data?.color}
                    onChange={(e) => setData("color", e.target.value)}
                    disabled={disabled || processing}
                />
                {errors.color && (
                    <p className="text-destructive text-sm">{errors.color}</p>
                )}
            </Field>
        </FieldGroup>
    );
}
