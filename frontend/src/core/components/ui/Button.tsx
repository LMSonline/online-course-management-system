"use client";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "soft" | "ghost" | "icon";
type Size = "sm" | "md";

const base = "inline-flex items-center justify-center font-semibold rounded-md transition";
const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-base",
};
const variants: Record<Variant, string> = {
    // ✅ chỉ CTA dùng màu xanh thương hiệu
    primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-700)] shadow-sm",
    // trung tính xám
    outline: "border border-slate-300 text-slate-800 hover:bg-slate-100",
    soft: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    ghost: "text-slate-800 hover:bg-slate-100",
    icon: `
  w-10 h-10 
  border border-slate-300/80
  text-slate-700
  bg-white
  hover:border-[var(--primary)]
  hover:text-[var(--primary)]
  hover:bg-[var(--primary)]/5
  transition-all duration-150
  flex items-center justify-center
  rounded-md
`,

};

export default function Button({
    className,
    children,
    variant = "primary",
    size = "md",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
}) {
    return (
        <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
            {children}
        </button>
    );
}
