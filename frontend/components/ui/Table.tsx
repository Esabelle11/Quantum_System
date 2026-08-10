
// frontend/components/ui/Table.tsx

import {
  type HTMLAttributes,
  type ReactNode,
  type ThHTMLAttributes,
  type TdHTMLAttributes
} from "react";

import {
  cn
} from "@/lib/utils";

interface TableProps
  extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export function Table({
  className,
  children,
  ...props
}: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          "w-full caption-bottom",
          "text-sm",
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export function TableHeader({
  className,
  children,
  ...props
}: TableHeaderProps) {
  return (
    <thead
      className={cn(
        "border-b border-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export function TableBody({
  className,
  children,
  ...props
}: TableBodyProps) {
  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0",
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

interface TableRowProps
  extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export function TableRow({
  className,
  children,
  ...props
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-slate-800",
        "transition-colors",
        "hover:bg-slate-800/40",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export function TableHead({
  className,
  children,
  ...props
}: TableHeadProps) {
  return (
    <th
      className={cn(
        "h-10 px-4",
        "text-left align-middle",
        "text-xs font-medium",
        "uppercase tracking-wider",
        "text-slate-500",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

interface TableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export function TableCell({
  className,
  children,
  ...props
}: TableCellProps) {
  return (
    <td
      className={cn(
        "px-4 py-3",
        "align-middle",
        "text-slate-300",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

export function TableCaption({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn(
        "mt-4 text-sm text-slate-500",
        className
      )}
      {...props}
    >
      {children}
    </caption>
  );
}

