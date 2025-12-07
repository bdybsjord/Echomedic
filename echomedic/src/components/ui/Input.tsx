import { forwardRef } from "react";
import clsx from "clsx";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...rest }, ref) => {
    return (
      <label className="block text-sm text-slate-200 space-y-1">
        {label && <span className="font-medium">{label}</span>}

        <input
          ref={ref}
          {...rest}
          className={clsx(
            "w-full rounded-lg bg-slate-900 border px-3 py-2 text-slate-100",
            "border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40",
            "placeholder:text-slate-500",
            error && "border-rose-500 focus:border-rose-500",
            className,
          )}
        />

        {error && <p className="text-xs text-rose-400">{error}</p>}
      </label>
    );
  },
);

export default Input;
