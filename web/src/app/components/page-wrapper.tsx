import type { ReactNode } from "react";

type PageWrapperProps<T extends keyof JSX.IntrinsicElements> = {
  /** HTML element to render. Defaults to `main` for semantic structure. */
  as?: T;
  /** Page content. */
  children: ReactNode;
  /** Additional Tailwind classes appended to the wrapper. */
  className?: string;
};

const BASE_CLASSES =
  "relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-24 lg:px-8";

export function PageWrapper<T extends keyof JSX.IntrinsicElements = "main">({
  as,
  children,
  className = "",
}: PageWrapperProps<T>) {
  const ComponentTag = (as ?? "main") as keyof JSX.IntrinsicElements;
  const mergedClasses = className
    ? `${BASE_CLASSES} ${className}`
    : BASE_CLASSES;

  return <ComponentTag className={mergedClasses}>{children}</ComponentTag>;
}
