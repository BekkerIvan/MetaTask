import { useForm } from "@inertiajs/react";
import React, { ReactNode, createContext, useContext } from "react";
import { InertiaFormProps } from "@inertiajs/react";
import { Errors, FormDataType, UseFormSubmitOptions } from "@inertiajs/core";
import {RouteDefinition} from "@/wayfinder";
import { Method } from "@/lib/https";

// FormDataType<T> requires a type argument; object is the widest valid base
// for the context slot — the component itself is still fully generic via TFields.
type FormContextValue<TFields extends FormDataType<TFields>> = {
    form: InertiaFormProps<TFields>;
};

const FormContext = createContext<FormContextValue<FormDataType<object>> | null>(null);

export function useFormContext<TFields extends FormDataType<TFields>>() {
    const ctx = useContext(FormContext as React.Context<FormContextValue<TFields> | null>);
    if (!ctx) {
        throw new Error("useFormContext must be used inside a <FormWrapper />");
    }
    return ctx.form;
}

interface FormWrapperProps<TFields extends FormDataType<TFields>> {
    /** Initial field values — drives the form's generic type */
    initialValues: TFields;
    /**
     * A called Wayfinder action, e.g. `store()` or `update({ country: country.id })`.
     * Provides both the URL and the HTTP method automatically.
     */
    formAction: RouteDefinition<Method>;
    /** Called after a successful submission */
    onSuccess?: () => void;
    /**
     * Called after a failed submission.
     * Receives Inertia's Errors type: Record<string, ErrorValue>
     */
    onError?: (errors: Errors) => void;
    /** ReactNode or render prop for direct form-bag access */
    children: ReactNode | ((form: InertiaFormProps<TFields>) => ReactNode);
    className?: string;
}

export default function FormWrapper<TFields extends FormDataType<TFields>>({
                                                                               initialValues,
                                                                               formAction,
                                                                               onSuccess,
                                                                               onError,
                                                                               children,
                                                                               className,
                                                                           }: FormWrapperProps<TFields>) {
    const form = useForm<TFields>(initialValues);

    // React.FormEvent is the non-deprecated replacement for FormEventHandler
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { method, url } = formAction;

        const submitOptions: UseFormSubmitOptions = {
            onSuccess: () => onSuccess?.(),
            onError: (errors: Errors) => onError?.(errors),
            onBefore: params => console.log(params)
        };

        form[method]?.(url, submitOptions);
    };

    return (
        <FormContext.Provider value={{ form } as unknown as FormContextValue<FormDataType<object>>}>
            <form onSubmit={handleSubmit} className={className}>
                {typeof children === "function"
                    ? (children as (form: InertiaFormProps<TFields>) => ReactNode)(form)
                    : children}
            </form>
        </FormContext.Provider>
    );
}
