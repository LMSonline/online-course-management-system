import React from 'react';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export function ScrollArea({ children, className = '', ...props }: ScrollAreaProps) {
    return (
        <div
            className={`overflow-auto ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
