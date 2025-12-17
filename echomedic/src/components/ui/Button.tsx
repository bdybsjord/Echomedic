import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  loading = false,
  children,
  className,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={loading || disabled}
      className={clsx(
        // base
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",

        // variants
        variant === "primary" &&
          "bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 shadow hover:opacity-90 focus-visible:ring-cyan-400",

        variant === "secondary" &&
          "bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-500",

        variant === "ghost" &&
          "bg-transparent text-slate-200 hover:bg-slate-800/60 focus-visible:ring-slate-500",

        variant === "danger" &&
          "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-400",

        className,
      )}
    >
      {loading ? "Laster..." : children}
    </button>
  );
}
