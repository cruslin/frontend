import Link from "next/link";
import { BookOpen, Crown, Heart, Sparkles } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/button-styles";

const coreValues = [
  {
    icon: Heart,
    title: "God-Interest",
    description:
      "We prize the pleasure, priorities, and agenda of God above personal preference and ambition.",
  },
  {
    icon: BookOpen,
    title: "Word-Cultured",
    description:
      "Scripture does not merely inform our doctrine. It forms our habits, identity, and spiritual imagination.",
  },
  {
    icon: Sparkles,
    title: "Spirit-Led",
    description:
      "We stay yielded to the Holy Spirit, cultivating sensitivity, obedience, and holy courage.",
  },
  {
    icon: Crown,
    title: "Kingdom-Focused",
    description:
      "Everything is aimed at advancing Christ's reign in lives, homes, vocations, cities, and nations.",
  },
];

export default function AboutPage() {
  return (
    <main className="page-bands">
      <PageHero
        eyebrow="About the Embassy"
        title="We exist to raise Word-cultured ambassadors."
        subtitle="A people shaped by Scripture, prayer, worship, and Kingdom purpose."
        description="The Ecclesia Embassy is a vibrant apostolic and prophetic ministry in Abuja, committed to forming believers who know Christ deeply, love His Word thoroughly, and represent Him faithfully in every sphere of life."
        backgroundImage="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80"
        actions={[
          { href: "/about/leadership", label: "Meet the Lead Brother", variant: "primary" },
          { href: "/about/experience", label: "The Ecclesia Experience", variant: "secondary", onDark: true },
        ]}
        stats={[
          { value: "Word", label: "A house centered on Scripture" },
          { value: "Kingdom", label: "A people formed for mission" },
          { value: "Worship", label: "A life poured out before God" },
        ]}
      />

      <SectionWrapper variant="white">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="The Vision"
              title="Raising Word-cultured ambassadors."
              description="We believe deep transformation happens when believers are immersed in God's Word, shaped by His presence, and sent into everyday life with clarity and conviction."
            />
            <div className="mt-8 space-y-5 text-base leading-8 text-gray-text">
              <p>
                At The Ecclesia Embassy, we are building a community where the Word of God is not
                peripheral but central. We want believers who do not simply visit truth on Sundays,
                but live from it daily as authentic representatives of Christ.
              </p>
              <p>
                Under the leadership of <span className="font-semibold text-slate">Brother Victor Oluwadamilare</span>,
                we cultivate an atmosphere where the Holy Spirit is honoured, mature discipleship is
                normal, and Kingdom service is intentional.
              </p>
              <p>
                Our gatherings are designed to produce people who can carry heaven into their homes,
                vocations, neighbourhoods, and nation with humility, authority, and love.
              </p>
            </div>
          </div>

          <div className="mesh-panel rounded-[32px] p-8 shadow-[0_30px_60px_rgba(14,11,30,0.08)]">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.28em] text-purple-vivid">
              Our Mandate
            </p>
            <h3 className="mt-4 font-heading text-3xl font-bold text-slate">
              To establish a generation that knows the Word and embodies Christ.
            </h3>
            <div className="mt-8 space-y-4 text-sm leading-7 text-gray-text">
              <p>We are committed to deep biblical literacy, spiritual maturity, and a life of surrendered worship.</p>
              <p>We serve the Kingdom by forming believers who can think scripturally, pray fervently, and live missionally.</p>
              <p>We are building not spectators, but servants and ambassadors with substance.</p>
            </div>
            <Link
              href="/new-here"
              className={buttonClasses({ variant: "primary", className: "mt-8" })}
            >
              Worship With Us
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="lavender">
        <SectionHeading
          eyebrow="Core Values"
          title="The convictions that shape our culture."
          description="These are the anchors that govern our ministry life, our relationships, and the way we respond to God's call."
          align="center"
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {coreValues.map((value) => {
            const Icon = value.icon;

            return (
              <article key={value.title} className="soft-card rounded-[30px] p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-light">
                  <Icon className="h-6 w-6 text-purple-vivid" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-bold text-slate">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-text">{value.description}</p>
              </article>
            );
          })}
        </div>
      </SectionWrapper>
    </main>
  );
}
