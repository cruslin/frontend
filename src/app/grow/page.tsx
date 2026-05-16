"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Music, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { buttonClasses } from "@/components/ui/button-styles";

const growthPaths = [
  {
    icon: GraduationCap,
    title: "Intentionality Class",
    desc: "A foundational training track to deepen understanding, establish rhythms, and prepare you for active growth.",
    href: "/grow/intentionality-class",
  },
  {
    icon: Users,
    title: "Church in the House",
    desc: "Find a local fellowship rhythm where spiritual formation becomes relational, practical, and consistent.",
    href: "/cith",
  },
  {
    icon: BookOpen,
    title: "Kingdom Life Squads",
    desc: "Join a serving team that helps you steward your gifts while contributing meaningfully to the life of the house.",
    href: "/kingdom-expressions/squads",
  },
  {
    icon: Music,
    title: "Ecclesia Music",
    desc: "Stay close to the sound of worship that shapes our gatherings and supports your private devotion.",
    href: "/resources/music",
  },
];

export default function GrowPage() {
  return (
    <main className="page-bands">
      <PageHero
        eyebrow="Grow"
        title="Take your next intentional step with us."
        subtitle="Formation is strongest when it is relational, structured, and steady."
        description="Whether you are new to the Embassy or ready for a deeper commitment, these pathways help you build rhythm, find community, and grow in purpose."
        backgroundImage="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&q=80"
        actions={[
          { href: "/new-here", label: "Start Here", variant: "primary" },
          { href: "/cith", label: "Find Community", variant: "secondary", onDark: true },
        ]}
        compact
      />

      <SectionWrapper variant="white">
        <SectionHeading
          eyebrow="Growth Pathways"
          title="Choose the path that matches your next season."
          description="At the Embassy, growth is never abstract. It becomes practical through classes, hubs, teams, and worshipping community."
          className="mb-12"
        />

        <StaggerContainer>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {growthPaths.map((path) => {
              const Icon = path.icon;

              return (
                <StaggerItem key={path.title}>
                  <Link
                    href={path.href}
                    className="group soft-card block rounded-[30px] p-8 transition-transform duration-200 hover:-translate-y-1"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-light text-purple-vivid">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 font-heading text-2xl font-bold text-slate">{path.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-text">{path.desc}</p>
                    <div className="mt-6 flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.22em] text-purple-vivid">
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </SectionWrapper>

      <SectionWrapper variant="dark-purple">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Ready?"
              title="Let Sunday become the start of a deeper rhythm."
              description="Join us in person, meet the people of the house, and start building the kind of habits that sustain long-term growth."
              align="center"
              className="mx-auto"
              titleClassName="text-white"
            />
            <Link
              href="/new-here"
              className={buttonClasses({ variant: "primary", className: "mt-8" })}
            >
              Plan Your Visit
            </Link>
          </div>
        </FadeIn>
      </SectionWrapper>
    </main>
  );
}
