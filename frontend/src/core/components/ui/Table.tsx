import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    className?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <div className="w-full overflow-auto">
                <table
                    ref={ref}
                    className={`w-full caption-bottom text-sm ${className}`}
                    {...props}
                />
            </div>
        );
    }
);

Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
        );
    }
);

TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
        );
    }
);

TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <tr
                ref={ref}
                className={`border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100 ${className}`}
                {...props}
            />
        );
    }
);

TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <th
                ref={ref}
                className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
                {...props}
            />
        );
    }
);

TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <td
                ref={ref}
                className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
                {...props}
            />
        );
    }
);

TableCell.displayName = 'TableCell';

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <tfoot
                ref={ref}
                className={`bg-gray-900 font-medium text-white ${className}`}
                {...props}
            />
        );
    }
);

TableFooter.displayName = 'TableFooter';

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <caption
                ref={ref}
                className={`mt-4 text-sm text-gray-500 ${className}`}
                {...props}
            />
        );
    }
);

TableCaption.displayName = 'TableCaption';

export default Table;
