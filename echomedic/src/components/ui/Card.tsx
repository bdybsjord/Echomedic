import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  children: ReactNode;
};

export default function Card({ className, children }: Props) {
  return (
    <div
      className={clsx(
        "glass-panel rounded-3xl border border-slate-800 p-5 shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
