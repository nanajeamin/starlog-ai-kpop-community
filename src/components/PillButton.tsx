import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "on-dark";

interface PillButtonProps {
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
}

const variantClass: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-charcoal active:scale-95",
  secondary: "bg-transparent text-ink border border-hairline-strong hover:border-ink hover:bg-surface",
  ghost: "bg-transparent text-steel hover:bg-surface hover:text-ink",
  "on-dark": "bg-white text-ink hover:bg-surface",
};

const sizeClass = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function PillButton({
  variant = "primary",
  href,
  onClick,
  children,
  className,
  disabled,
  type = "button",
  size = "md",
}: PillButtonProps) {
  const base = cn(
    "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-150 cursor-pointer whitespace-nowrap",
    variantClass[variant],
    sizeClass[size],
    disabled && "opacity-40 cursor-not-allowed",
    className
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}
