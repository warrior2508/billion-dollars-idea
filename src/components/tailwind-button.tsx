"use client";
import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const ButtonsCard = ({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "h-60 w-full bg-white rounded-xl border border-neutral-100 dark:bg-black dark:border-white/[0.2] hover:border-neutral-200 group/btn overflow-hidden relative flex items-center justify-center",
        className
      )}
    >
      <div className="absolute inset-0 dark:bg-dot-white/[0.1] bg-dot-black/[0.1]" />
      <div className="relative z-40">{children}</div>
    </div>
  );
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const TailwindButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-indigo-600 text-white hover:bg-indigo-700": variant === "primary",
            "bg-gray-200 text-gray-900 hover:bg-gray-300": variant === "secondary",
            "border border-gray-300 bg-transparent hover:bg-gray-100": variant === "outline",
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4": size === "md",
            "h-12 px-6 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

TailwindButton.displayName = "TailwindButton";

export { TailwindButton };
