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
                className={`flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm ring-offset-white dark:ring-offset-slate-950 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
    ({ children, className = '', ...props }, ref) => {
        return (
            <option ref={ref} className={`bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${className}`} {...props}>
                {children}
            </option>
        );
    }
);

SelectItem.displayName = 'SelectItem';

export { Select };
export default Select;
