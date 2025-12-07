import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: ReactNode;
};

export default function Button({ loading, children, className, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
        "bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 shadow",
        "hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {loading ? "Laster..." : children}
    </button>
  );
}
