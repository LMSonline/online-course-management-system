import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
    children: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...props}
            >
                {children}
            </select>
        );
    }
);

Select.displayName = 'Select';

export const SelectTrigger = Select;

export const SelectValue: React.FC<{ placeholder?: string; className?: string }> = () => null;

export const SelectContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children }) => <>{children}</>;

export const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
    ({ children, ...props }, ref) => {
        return (
            <option ref={ref} {...props}>
                {children}
            </option>
        );
    }
);

SelectItem.displayName = 'SelectItem';

export default Select;
