import Link from "next/link";
import { BookOpen, Library, Mic2, PlayCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";

const resourceCards = [
  {
    icon: Mic2,
    title: "Audio Archive",
    description: "Listen again to past teachings, sermons, and meditations while you work, travel, or pray.",
    href: "/resources/audio",
  },
  {
    icon: PlayCircle,
    title: "Video Messages",
    description: "Watch recent sermons, livestream replays, and visual teaching moments from the house.",
    href: "/resources/video",
  },
  {
    icon: Library,
    title: "Ecclesia Library",
    description: "Browse reading materials and curated resources designed to strengthen conviction and understanding.",
    href: "/resources/library",
  },
  {
    icon: BookOpen,
    title: "Ecclesia Music",
    description: "Return to songs and sounds that support worship, reflection, and spiritual formation.",
    href: "/resources/music",
  },
];

export default function ResourcesPage() {
  return (
    <main className="page-bands">
      <PageHero
        eyebrow="Resources"
        title="Keep feeding on the Word between gatherings."
        subtitle="Sermons, music, and study resources gathered in one place."
        description="The life of the house should continue with you through the week. Explore messages and media that help you meditate, revisit truth, and stay spiritually warm."
        backgroundImage="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80"
        compact
      />

      <SectionWrapper variant="white">
        <SectionHeading
          eyebrow="Choose a Format"
          title="Go where you engage best."
          description="Some moments call for headphones, some for video, some for notes and long-form study. Start where you are and keep growing."
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {resourceCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                className="group soft-card rounded-[30px] p-7 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-light text-purple-vivid">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 font-heading text-2xl font-bold text-slate">{card.title}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-text">{card.description}</p>
                <p className="mt-6 font-heading text-xs font-semibold uppercase tracking-[0.22em] text-purple-vivid">
                  Open Resource
                </p>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>
    </main>
  );
}
