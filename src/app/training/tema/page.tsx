"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/Motion";
import { useState } from "react";
import {
  Music,
  Mic,
  Layers,
  Users,
  Palette,
  Film,
  Check,
  Phone,
  Mail,
  BookOpen,
  Zap,
  Star,
  ArrowDown,
  Drum,
} from "lucide-react";
import { training } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const programs = [
  {
    id: "IM",
    name: "Instrument Mastery",
    icon: Music,
    desc: "Build mastery across three dynamic streams — Classical (violin, viola, cello, flute, trumpet), Contemporary (keyboard, guitars, saxophone), and Percussion (drums, talking drum, conga, cymbals).",
    streams: ["Classical", "Contemporary", "Percussion"],
  },
  {
    id: "VOICES",
    name: "Voices",
    icon: Mic,
    desc: "Develop your voice, singing, and vocal expressions with proven techniques that unlock the full potential of your sound.",
    streams: [],
  },
  {
    id: "MCP",
    name: "Music Composition & Production",
    icon: Layers,
    desc: "Create, arrange, and produce music that carries purpose. From arrangement to final mix, learn to craft sound with intentionality.",
    streams: [],
  },
  {
    id: "DANCE",
    name: "Dance and Movement",
    icon: Zap,
    desc: "Learn to express beauty, rhythm, and grace through inspired movement — a ministry in itself.",
    streams: [],
  },
  {
    id: "MLT",
    name: "Music Leadership Training",
    icon: Users,
    desc: "Develop leadership and team management skills to lead creatives, choirs, orchestras, and music institutions with wisdom and excellence.",
    streams: [],
  },
  {
    id: "AD",
    name: "Artistry and Design",
    icon: Palette,
    desc: "Showcase Heaven's creativity through drawing, painting, design, and more — visual art in service of the kingdom.",
    streams: [],
  },
  {
    id: "SAL",
    name: "Stories and Lights",
    icon: Film,
    desc: "Develop acting, storytelling, and stage presence for live and screen ministrations. A studio and theatre course for expressive communicators.",
    streams: [],
  },
];

const experiences = [
  {
    icon: BookOpen,
    title: "Sound instruction from God's Word",
    desc: "Every lesson is anchored in scripture, forming the whole person — not just the musician.",
  },
  {
    icon: Star,
    title: "Lessons that meet you where you are",
    desc: "Easy to follow and designed to grow with you, no matter your starting level.",
  },
  {
    icon: Drum,
    title: "Go beyond excellence",
    desc: "Become a vessel of mastery in your instrument and craft — excellence is the floor, not the ceiling.",
  },
  {
    icon: Music,
    title: "Play in groups and orchestras",
    desc: "Bond with others and create powerful expressions in music, dance, and more through collaborative performance.",
  },
  {
    icon: Users,
    title: "Grow as a disciplined minister",
    desc: "Leave shaped as an intentional minister — not just a performer, but a carrier of sound with purpose.",
  },
];

const programSelectOptions = programs.map((p) => p.name);

export default function TEMAPage() {
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await training.enrollTraining("TEMA", {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        additionalInfo: {
          course: formData.get("course") as string,
        },
      });
      success("Enrollment successful! Welcome to TEMA.");
      setEnrolled(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to enroll. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 md:py-36 text-white bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.22),transparent_38%),linear-gradient(135deg,#0A0718_0%,#12102A_48%,#1E1040_100%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
        <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 text-center">
          <FadeIn direction="up">
            <span className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 font-heading text-[11px] font-semibold uppercase tracking-[2.5px] text-gold">
              The Ecclesia Music and Arts Academy
            </span>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <h1 className="mt-6 font-heading text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              The Call
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.18}>
            <p className="mt-5 font-serif text-xl italic text-white/80 md:text-2xl">
              TEMA — Where Spirit-led musicians are made
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.26}>
            <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-8 text-white/65 md:text-lg">
              Every generation carries a divine sound — a summons to rise, rebuild, and restore
              God's order through music. This is not just another music school. It is a call.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.34}>
            <div className="mx-auto mt-8 max-w-xl rounded-[22px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <p className="font-body text-sm leading-7 text-white/72 italic">
                "This call is designed to take students from mere interest to love, and from love
                to passion — for music does not truly produce until you are passionate."
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.42}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button variant="primary" onClick={() => scrollTo("enroll")}>
                Take the Step
              </Button>
              <Button variant="secondary" onDark onClick={() => scrollTo("programs")}>
                Explore Programs
              </Button>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.5}>
            <div className="mt-12 grid gap-3 sm:grid-cols-3 mx-auto max-w-2xl">
              {[
                { value: "7+", label: "program tracks" },
                { value: "Classical · Contemporary", label: "& Percussion streams" },
                { value: "All levels", label: "beginners to advanced" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[22px] border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm"
                >
                  <p className="font-heading text-xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 font-body text-xs uppercase tracking-[1.4px] text-white/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          <button
            onClick={() => scrollTo("experience")}
            aria-label="Scroll down"
            className="mt-14 mx-auto flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ── THE YOU EXPERIENCE ── */}
      <SectionWrapper variant="white" id="experience">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[2px] text-gold">
            The You Experience
          </p>
          <h2 className="mt-3 font-heading text-[30px] font-bold text-slate md:text-[36px]">
            What to Expect
          </h2>
          <p className="mt-3 font-body text-sm leading-7 text-gray-text md:text-base">
            At The Ecclesia Music and Arts Academy, every session is designed to shape you inside and out.
            Our students don't just learn — they are transformed.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-[24px] border border-gray-border bg-off-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1E1040,#3B1F80)] text-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-slate">{item.title}</h3>
                <p className="mt-2 font-body text-sm leading-7 text-gray-text">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* ── PROGRAMS ── */}
      <SectionWrapper variant="off-white" id="programs">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[2px] text-gold">
            Programs We Offer
          </p>
          <h2 className="mt-3 font-heading text-[30px] font-bold text-slate md:text-[36px]">
            Designed to meet you at your level
          </h2>
          <p className="mt-3 font-body text-sm leading-7 text-gray-text md:text-base">
            Whether you're just beginning or stepping into mastery, there's a pathway here for you.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <div
                key={program.id}
                className="rounded-[28px] border border-gray-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1E1040,#3B1F80)] text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-purple px-2.5 py-1 font-heading text-[9px] font-bold uppercase tracking-[1.5px] text-white">
                        {program.id}
                      </span>
                    </div>
                    <h3 className="mt-2 font-heading text-base font-bold text-slate">
                      {program.name}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-6 text-gray-text">{program.desc}</p>
                    {program.streams.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {program.streams.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 font-heading text-[10px] font-semibold uppercase tracking-[1.2px] text-slate"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center font-body text-sm italic text-gray-text">
          And much more programs… Program details will be announced across all platforms.
        </p>
      </SectionWrapper>

      {/* ── CONTACT & ENROLL ── */}
      <SectionWrapper variant="dark-purple" id="enroll">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Contact info */}
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[2px] text-gold">
              If this stirs something within you…
            </p>
            <h2 className="mt-3 font-heading text-[30px] font-bold text-white md:text-[34px]">
              Then this call is yours.
            </h2>
            <p className="mt-4 font-body text-sm leading-7 text-white/65">
              Take the step today. Reach out to us directly, or fill in the form and we'll be in touch.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[20px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20">
                    <Phone className="h-4 w-4 text-gold" />
                  </div>
                  <p className="font-heading text-xs font-semibold uppercase tracking-[1.6px] text-white/55">
                    Phone
                  </p>
                </div>
                <div className="mt-3 space-y-1 pl-1">
                  <p className="font-body text-base font-medium text-white">+234 803 400 7867</p>
                  <p className="font-body text-base font-medium text-white">+234 806 120 9000</p>
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20">
                    <Mail className="h-4 w-4 text-gold" />
                  </div>
                  <p className="font-heading text-xs font-semibold uppercase tracking-[1.6px] text-white/55">
                    Email
                  </p>
                </div>
                <p className="mt-3 pl-1 font-body text-base font-medium text-white break-all">
                  theecclesiamusicandarts@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Enrollment form */}
          <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-sm md:p-8">
            <h3 className="font-heading text-xl font-bold text-white">Register Your Interest</h3>
            <p className="mt-1 font-body text-sm text-white/55">
              Submit your details and we'll be in touch with next steps.
            </p>

            {enrolled ? (
              <div className="mt-6 rounded-[18px] bg-white/10 p-8 text-center">
                <Check className="mx-auto h-10 w-10 text-gold mb-3" />
                <h4 className="font-heading text-lg font-bold text-white">You're Registered!</h4>
                <p className="mt-2 font-body text-sm text-white/65">
                  We'll reach out soon. Welcome to The Ecclesia Music and Arts Academy.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <Input id="name" name="name" placeholder="Full Name" required />
                <Input id="email" name="email" type="email" placeholder="Email Address" required />
                <Input id="phone" name="phone" type="tel" placeholder="Phone Number" required />
                <select
                  id="course"
                  name="course"
                  required
                  defaultValue=""
                  className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] placeholder:text-[#8A8A90] focus:outline-none focus:border-[#C9A84C] transition-colors"
                >
                  <option value="" disabled>Select a program...</option>
                  {programSelectOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <Button type="submit" variant="giving" className="w-full mt-1" disabled={loading}>
                  {loading ? "Submitting..." : "Take the Step"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
