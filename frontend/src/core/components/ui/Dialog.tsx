import React from 'react';

export interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => onOpenChange?.(false)}
            />
            {children}
        </div>
    );
};

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

DialogContent.displayName = 'DialogContent';

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ className = '', children, ...props }) => {
    return (
        <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
            {children}
        </div>
    );
};

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: React.ReactNode;
}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <h2
                ref={ref}
                className={`text-lg font-semibold leading-none tracking-tight ${className}`}
                {...props}
            >
                {children}
            </h2>
        );
    }
);

DialogTitle.displayName = 'DialogTitle';

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string;
    children: React.ReactNode;
}

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={`text-sm text-gray-500 ${className}`}
                {...props}
            >
                {children}
            </p>
        );
    }
);

DialogDescription.displayName = 'DialogDescription';

export default Dialog;
