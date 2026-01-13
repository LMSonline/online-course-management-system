import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
    children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
    return <div className="relative inline-block">{children}</div>;
}

interface DropdownMenuTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
    return <>{children}</>;
}

interface DropdownMenuContentProps {
    align?: 'start' | 'end' | 'center';
    children: React.ReactNode;
}

export function DropdownMenuContent({ align = 'start', children }: DropdownMenuContentProps) {
    const alignClass = align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0';

    return (
        <div className={`absolute ${alignClass} mt-2 min-w-[200px] rounded-md border bg-white shadow-lg z-50`}>
            <div className="p-1">{children}</div>
        </div>
    );
}

interface DropdownMenuItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export function DropdownMenuItem({ children, onClick, className = '' }: DropdownMenuItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
}
