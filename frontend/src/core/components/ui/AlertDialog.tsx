import React from 'react';

export interface AlertDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm"
                onClick={() => onOpenChange?.(false)}
            />
            {children}
        </div>
    );
};

export interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

export const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`relative z-50 w-full max-w-lg rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-lg ${className}`}
                onClick={(e) => e.stopPropagation()}
                {...props}
            >
                {children}
            </div>
        );
    }
);

AlertDialogContent.displayName = 'AlertDialogContent';

export const AlertDialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
    return (
        <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`} {...props}>
            {children}
        </div>
    );
};

export const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <h2
                ref={ref}
                className={`text-lg font-semibold text-slate-900 dark:text-white ${className}`}
                {...props}
            >
                {children}
            </h2>
        );
    }
);

AlertDialogTitle.displayName = 'AlertDialogTitle';

export const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={`text-sm text-slate-600 dark:text-slate-400 ${className}`}
                {...props}
            >
                {children}
            </p>
        );
    }
);

AlertDialogDescription.displayName = 'AlertDialogDescription';

export const AlertDialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
    return (
        <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const AlertDialogAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className = '', children, onClick, ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                className={`inline-flex h-10 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        );
    }
);

AlertDialogCancel.displayName = 'AlertDialogCancel';

export const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ children, ...props }, ref) => {
        return (
            <button ref={ref} {...props}>
                {children}
            </button>
        );
    }
);

AlertDialogTrigger.displayName = 'AlertDialogTrigger';

export default AlertDialog;
