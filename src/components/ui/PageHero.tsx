import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonClasses, type ButtonVariant } from "@/components/ui/button-styles";

type HeroAction = {
  href: string;
  label: string;
  variant?: ButtonVariant;
  onDark?: boolean;
};

type HeroStat = {
  value: string;
  label: string;
};

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  actions?: HeroAction[];
  stats?: HeroStat[];
  align?: "left" | "center";
  className?: string;
  compact?: boolean;
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  description,
  backgroundImage,
  actions,
  stats,
  align = "center",
  className,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        compact ? "py-16 sm:py-24 md:py-28" : "py-20 sm:py-28 md:py-36",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={
          backgroundImage
            ? {
                backgroundImage: `url('${backgroundImage}')`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }
            : undefined
        }
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.22),_transparent_34%),linear-gradient(135deg,_rgba(9,7,26,0.92)_0%,_rgba(14,11,30,0.9)_48%,_rgba(33,18,55,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,_transparent_0%,_rgba(14,11,30,0.52)_100%)]" />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
        <div
          className={cn(
            "max-w-4xl",
            align === "center" && "mx-auto text-center"
          )}
        >
          {eyebrow ? (
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.34em] text-gold">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-5 font-serif text-xl italic text-white/88 md:text-2xl">
              {subtitle}
            </p>
          ) : null}
          {description ? (
            <p className="mt-5 max-w-3xl font-body text-base leading-7 text-white/72 md:text-lg">
              {description}
            </p>
          ) : null}

          {actions?.length ? (
            <div
              className={cn(
                "mt-10 flex flex-wrap gap-3",
                align === "center" && "justify-center"
              )}
            >
              {actions.map((action) => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  className={buttonClasses({
                    variant: action.variant ?? "primary",
                    onDark: action.onDark ?? true,
                  })}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}

          {stats?.length ? (
            <div
              className={cn(
                "mt-10 sm:mt-12 grid gap-2 sm:gap-3 sm:grid-cols-3",
                align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"
              )}
            >
              {stats.map((stat) => (
                <div
                  key={`${stat.label}-${stat.value}`}
                  className="rounded-[28px] border border-white/12 bg-white/8 px-5 py-5 backdrop-blur-md"
                >
                  <p className="font-heading text-2xl font-bold text-white md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-body text-sm text-white/58">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
