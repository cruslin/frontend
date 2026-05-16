import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";

const expressions = [
  {
    icon: Users,
    title: "Kingdom Life Squads",
    description: "Serve in a ministry team, contribute your gifts, and build the house alongside other believers.",
    href: "/kingdom-expressions/squads",
  },
  {
    icon: BriefcaseBusiness,
    title: "Kingdom Influencing Platform",
    description: "Develop conviction for culture, vocation, and influence so your work becomes a place of Kingdom witness.",
    href: "/kingdom-expressions/kip",
  },
];

export default function KingdomPage() {
  return (
    <main className="page-bands">
      <PageHero
        eyebrow="Kingdom Expressions"
        title="Faith should shape the way we serve and the way we influence."
        subtitle="Find the place where your gifts, service, and calling meet."
        description="The Embassy is not only a place to receive. It is a place to contribute, build, and express Christ's life through service, excellence, and Kingdom responsibility."
        backgroundImage="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
        compact
      />

      <SectionWrapper variant="white">
        <SectionHeading
          eyebrow="Find Your Expression"
          title="Two clear pathways to serve and influence."
          description="Join a serving community inside the house or sharpen your Kingdom presence in the world of work and culture."
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {expressions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group soft-card rounded-[30px] p-7 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-light text-purple-vivid">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 font-heading text-2xl font-bold text-slate">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-gray-text">{item.description}</p>
                <div className="mt-6 flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.22em] text-purple-vivid">
                  Explore Pathway
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>
    </main>
  );
}
