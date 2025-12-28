import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
    className?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className = '', variant = 'default', ...props }, ref) => {
        const variantStyles = {
            default: 'bg-blue-500 text-white hover:bg-blue-600',
            secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
            outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100',
            destructive: 'bg-red-500 text-white hover:bg-red-600',
        };

        return (
            <div
                ref={ref}
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${variantStyles[variant]} ${className}`}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';

export default Badge;
