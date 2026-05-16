"use client";

import { cn } from "@/lib/utils";
import { FadeIn, Float } from "@/components/ui/Motion";
import Image from "next/image";
import { ReactNode } from "react";

type HeroStat = {
  label: string;
  value: string;
};

interface ProgramHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  chips?: string[];
  stats?: HeroStat[];
  actions?: ReactNode;
  aside?: ReactNode;
  backgroundClassName?: string;
  overlayClassName?: string;
  logoCardClassName?: string;
  logoWrapClassName?: string;
  logoClassName?: string;
  statCardClassName?: string;
}

export default function ProgramHero({
  eyebrow,
  title,
  subtitle,
  description,
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  chips = [],
  stats = [],
  actions,
  aside,
  backgroundClassName,
  overlayClassName,
  logoCardClassName,
  logoWrapClassName,
  logoClassName,
  statCardClassName,
}: ProgramHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-20 text-white md:py-28",
        backgroundClassName
      )}
    >
      <div className={cn("absolute inset-0", overlayClassName)} />
      <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn direction="up">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-heading text-[11px] font-semibold uppercase tracking-[2px] text-white/80">
                {eyebrow}
              </span>
            </FadeIn>

            <FadeIn direction="up" delay={0.08}>
              <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                {title}
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.16}>
              <p className="mt-4 max-w-2xl font-serif text-lg text-white/85 md:text-[22px]">
                {subtitle}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.24}>
              <p className="mt-5 max-w-2xl font-body text-sm leading-7 text-white/70 md:text-base">
                {description}
              </p>
            </FadeIn>

            {chips.length > 0 && (
              <FadeIn direction="up" delay={0.32}>
                <div className="mt-6 flex flex-wrap gap-3">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/15 bg-black/15 px-4 py-2 font-body text-xs text-white/80 backdrop-blur-sm"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </FadeIn>
            )}

            {actions ? (
              <FadeIn direction="up" delay={0.4} className="mt-8 flex flex-wrap gap-3">
                {actions}
              </FadeIn>
            ) : null}
          </div>

          <Float>
            <div
              className={cn(
                "rounded-[30px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md md:p-7",
                logoCardClassName
              )}
            >
              <div
                className={cn(
                  "relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[24px] bg-white/90 p-6 shadow-inner md:min-h-[320px] md:p-8",
                  logoWrapClassName
                )}
              >
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={logoWidth}
                  height={logoHeight}
                  priority
                  className={cn("h-auto w-full object-contain", logoClassName)}
                />
              </div>

              {aside ? (
                <div className="mt-5 rounded-[20px] border border-white/10 bg-black/15 p-5">
                  {aside}
                </div>
              ) : null}
            </div>
          </Float>
        </div>

        {stats.length > 0 && (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <FadeIn key={stat.label} direction="up">
                <div
                  className={cn(
                    "rounded-[22px] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm",
                    statCardClassName
                  )}
                >
                  <p className="font-heading text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 font-body text-xs uppercase tracking-[1.5px] text-white/60">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
