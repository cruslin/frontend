import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.32em] text-purple-vivid">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-3 font-heading text-3xl font-bold tracking-tight text-slate md:text-5xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl font-body text-base leading-7 text-gray-text md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
