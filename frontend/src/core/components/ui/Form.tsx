import React, { createContext, useContext } from 'react';
import { useFormContext, Controller, FieldValues, FieldPath, ControllerProps } from 'react-hook-form';

interface FormFieldContextValue {
    name: string;
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

interface FormItemContextValue {
    id: string;
}

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

export function Form({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
    return <form {...props}>{children}</form>;
}

export function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
}

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={`space-y-2 ${className || ''}`} {...props} />
        </FormItemContext.Provider>
    );
}

export function FormLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    const { id } = useContext(FormItemContext);

    return (
        <label
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
            htmlFor={id}
            {...props}
        />
    );
}

export function FormControl({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { id } = useContext(FormItemContext);

    return <div id={id} {...props} />;
}

export function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={`text-sm text-gray-500 ${className || ''}`}
            {...props}
        />
    );
}

export function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    const { name } = useContext(FormFieldContext);
    const { formState } = useFormContext();
    const error = formState.errors[name];
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            className={`text-sm font-medium text-red-500 ${className || ''}`}
            {...props}
        >
            {body}
        </p>
    );
}
