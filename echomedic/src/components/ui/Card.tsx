import type { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <section
      className={clsx(
        "glass-panel rounded-3xl p-8 shadow-xl shadow-slate-950/60",
        className
      )}
    >
      {children}
    </section>
  );
}
