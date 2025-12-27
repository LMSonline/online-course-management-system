import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
    defaultValue = '',
    value: controlledValue,
    onValueChange,
    className = '',
    children
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className = '', children, ...props }) => {
    return (
        <div
            className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    className?: string;
    children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value: triggerValue, className = '', children, ...props }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const { value, onValueChange } = context;
    const isActive = value === triggerValue;

    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                } ${className}`}
            onClick={() => onValueChange(triggerValue)}
            {...props}
        >
            {children}
        </button>
    );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    className?: string;
    children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value: contentValue, className = '', children, ...props }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    const { value } = context;

    if (value !== contentValue) return null;

    return (
        <div
            className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Tabs;
