import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    className?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <input
                type="checkbox"
                ref={ref}
                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...props}
            />
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
