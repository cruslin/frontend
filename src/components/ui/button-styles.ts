import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "giving";

const buttonBaseClasses =
  "inline-flex items-center justify-center gap-2 font-heading text-[13px] font-semibold uppercase tracking-[1.5px] leading-4 transition-all duration-200 ease-in-out disabled:cursor-not-allowed";

export function buttonClasses({
  variant = "primary",
  onDark,
  className,
}: {
  variant?: ButtonVariant;
  onDark?: boolean;
  className?: string;
}) {
  const variants: Record<ButtonVariant, string> = {
    primary: cn(
      "rounded-full bg-gold px-8 py-3 text-[#0E0B1E] shadow-[0_14px_28px_rgba(201,168,76,0.2)]",
      "hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-[0_16px_32px_rgba(201,168,76,0.28)]",
      "active:translate-y-0 active:shadow-[0_8px_18px_rgba(201,168,76,0.18)]",
      "disabled:bg-gold-light disabled:text-[#0E0B1E]/50 disabled:shadow-none"
    ),
    secondary: cn(
      "rounded-full border px-8 py-3 backdrop-blur-sm",
      onDark
        ? "border-white/20 bg-white/6 text-white hover:border-gold/55 hover:bg-white/10 hover:text-gold"
        : "border-slate/12 bg-white text-slate hover:border-slate/25 hover:bg-slate/4"
    ),
    ghost: cn(
      "bg-transparent px-4 py-2 text-gold",
      "hover:text-gold-dark hover:underline"
    ),
    giving: cn(
      "rounded-full bg-gradient-to-r from-gold-dark to-gold px-10 py-4 text-[#0E0B1E] shadow-[0_18px_34px_rgba(201,168,76,0.24)]",
      "hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_20px_40px_rgba(201,168,76,0.32)]",
      "disabled:opacity-50 disabled:shadow-none"
    ),
  };

  return cn(buttonBaseClasses, variants[variant], className);
}
