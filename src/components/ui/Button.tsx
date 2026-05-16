"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/button-styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  /** On dark background - affects secondary button styling */
  onDark?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", loading, onDark, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={buttonClasses({ variant, onDark, className })}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
