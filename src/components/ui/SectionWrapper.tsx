import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type SectionVariant =
  | "dark-purple"
  | "dark-slate"
  | "charcoal"
  | "white"
  | "off-white"
  | "lavender";

interface SectionWrapperProps {
  variant?: SectionVariant;
  className?: string;
  children: ReactNode;
  id?: string;
}

const variantStyles: Record<SectionVariant, string> = {
  "dark-purple":
    "bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.18),_transparent_42%),linear-gradient(180deg,_#161129_0%,_#0E0B1E_100%)] text-white",
  "dark-slate":
    "bg-[radial-gradient(circle_at_top_right,_rgba(201,168,76,0.12),_transparent_35%),linear-gradient(180deg,_#151124_0%,_#0E0B1E_100%)] text-white",
  charcoal:
    "bg-[radial-gradient(circle_at_top_left,_rgba(201,168,76,0.08),_transparent_34%),linear-gradient(180deg,_#120F20_0%,_#09071A_100%)] text-white",
  white: "bg-[linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(250,250,248,0.96)_100%)] text-slate",
  "off-white":
    "bg-[linear-gradient(180deg,_rgba(250,250,248,1)_0%,_rgba(245,241,232,0.72)_100%)] text-slate",
  lavender:
    "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_45%),linear-gradient(180deg,_#F5F0E6_0%,_#E8E6F0_100%)] text-slate",
};

export default function SectionWrapper({
  variant = "white",
  className,
  children,
  id,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("relative isolate overflow-hidden py-18 md:py-24", variantStyles[variant], className)}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
        {children}
      </div>
    </section>
  );
}
