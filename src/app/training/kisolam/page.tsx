"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import ProgramHero from "@/components/training/ProgramHero";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Calendar,
  GraduationCap,
  User,
} from "lucide-react";
import { training } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

type Program = {
  id: string;
  name: string;
  shortName?: string;
  duration: string;
  desc: string;
  feeType: "paid" | "variable";
  fee?: number;
  feeCurrency?: string;
};

const programs: Program[] = [
  {
    id: "DTD",
    name: "Discipleship Training Deluge",
    shortName: "DTD",
    duration: "3 months",
    desc: "An intensive discipleship track designed to ground believers in the foundations of faith, kingdom identity, and missional living.",
    feeType: "paid",
    fee: 20000,
    feeCurrency: "NGN ",
  },
  {
    id: "SENATE",
    name: "Senate of Ambassadorial Army",
    duration: "6 months",
    desc: "Advanced formation for those called to ambassadorial ministry, with strategic, apostolic, and prophetic depth.",
    feeType: "paid",
    fee: 25000,
    feeCurrency: "NGN ",
  },
  {
    id: "SMIT",
    name: "Six Months Intensive Training",
    shortName: "SMIT",
    duration: "6 months",
    desc: "A comprehensive curriculum covering doctrine, church planting, leadership, and practical ministry in one immersive season.",
    feeType: "paid",
    fee: 30000,
    feeCurrency: "NGN ",
  },
  {
    id: "SPOUDAZO",
    name: "Summer Spoudazo",
    duration: "4-6 weeks",
    desc: "A seasonal intensive for all ages. Program fees vary by session and schedule.",
    feeType: "variable",
    feeCurrency: "NGN ",
  },
  {
    id: "WORKSHOP",
    name: "Special Workshop Program",
    duration: "1-3 days",
    desc: "Short topic-focused workshops throughout the year. Some sessions are free while others require registration.",
    feeType: "variable",
    feeCurrency: "NGN ",
  },
];

const formationPillars = [
  {
    title: "Doctrine and Identity",
    desc: "Courses are built to establish a strong biblical foundation and kingdom consciousness.",
    icon: BookOpen,
  },
  {
    title: "Ministerial Formation",
    desc: "Students are trained in service, leadership, and responsible ministry expression.",
    icon: GraduationCap,
  },
  {
    title: "Community Journey",
    desc: "Learning happens within a living community that encourages accountability and growth.",
    icon: User,
  },
];

const facultyRoles = [
  "Lead Faculty",
  "Associate Faculty",
  "Guest Faculty",
];

const formatFee = (program: Program) => {
  if (program.feeType === "variable") return "Variable";
  return `${program.feeCurrency || "NGN "}${(program.fee || 0).toLocaleString()}`;
};

export default function KISOLAMPage() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"form" | "processing">("form");
  const [customAmount, setCustomAmount] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const { success, error } = useToast();

  function openEnroll(program: Program) {
    setSelectedProgram(program);
    setFormData({ name: "", email: "", phone: "" });
    setCustomAmount("");
    setStep("form");
    setShowModal(true);
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleEnrollAndPay(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProgram) return;

    const amount = selectedProgram.feeType === "paid"
      ? selectedProgram.fee!
      : Number(customAmount);

    if (selectedProgram.feeType === "variable" && customAmount === "") {
      error("Please enter the program fee. Enter 0 for free sessions.");
      return;
    }

    if (selectedProgram.feeType === "variable" && amount < 0) {
      error("Amount cannot be negative.");
      return;
    }

    setStep("processing");
    try {
      const enrollment = await training.enrollTraining("KISOLAM", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        additionalInfo: {
          program: selectedProgram.name,
          programId: selectedProgram.id,
        },
      });

      if (amount === 0) {
        success("Registration successful. Check your email for details.");
        setShowModal(false);
        window.location.href = `/training/kisolam/enrollment/${enrollment.id}`;
        return;
      }

      const payment = await training.initializePayment({
        enrollmentId: enrollment.id,
        amount,
        email: formData.email,
        name: formData.name,
        program: selectedProgram.name,
      });

      window.location.href = payment.authorization_url +
        `?callback_url=${encodeURIComponent(
          `${window.location.origin}/training/kisolam/enrollment/${enrollment.id}?ref=${payment.reference}`
        )}`;
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to process. Please try again.");
      setStep("form");
    }
  }

  return (
    <>
      <ProgramHero
        eyebrow="Kingdom Training"
        title="KISOLAM"
        subtitle="Kingdom International School of Life and Ministry"
        description="Equipping kingdom citizens for life, leadership, and ministry through structured training, doctrinal depth, and apostolic impartation."
        logoSrc="/kisolam-logo.png"
        logoAlt="KISOLAM"
        logoWidth={422}
        logoHeight={456}
        chips={[
          "Foundational discipleship",
          "Leadership development",
          "Practical ministry formation",
        ]}
        stats={[
          { value: "5", label: "program tracks" },
          { value: "Jan / Jul", label: "session starts" },
          { value: "3-6 mo", label: "core duration" },
        ]}
        backgroundClassName="bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.2),transparent_30%),linear-gradient(135deg,#0E0B1E_0%,#1A1530_45%,#45266C_100%)]"
        overlayClassName="bg-[linear-gradient(180deg,rgba(14,11,30,0.14),rgba(14,11,30,0.52))]"
        logoCardClassName="bg-white/8"
        logoWrapClassName="bg-[radial-gradient(circle_at_top,#fff6da_0%,#ffffff_48%,#f4efff_100%)]"
        logoClassName="max-w-[220px]"
        aside={
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[1.8px] text-white/60">
              Inside the school
            </p>
            <div className="mt-4 space-y-3">
              {[
                "Structured modules for doctrine, devotion, and kingdom service.",
                "Tracks that serve both entry-level learners and emerging leaders.",
                "Flexible options for intensive sessions and short workshops.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-gold" />
                  <p className="font-body text-sm leading-6 text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        }
        actions={
          <>
            <Button variant="primary" onClick={() => openEnroll(programs[0])}>
              Start Enrollment
            </Button>
            <Button variant="secondary" onDark onClick={() => scrollToSection("programs")}>
              Explore Programs
            </Button>
          </>
        }
      />

      <SectionWrapper variant="white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-[30px] font-bold text-slate md:text-[34px]">
            A formation pathway with depth and direction
          </h2>
          <p className="mt-3 font-body text-sm leading-7 text-gray-text md:text-base">
            KISOLAM is designed to move learners from conviction to competence. Each program is built
            to strengthen scriptural understanding, shape character, and prepare people for faithful
            kingdom expression.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {formationPillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.title}
                className="rounded-[24px] border border-gray-border bg-off-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple text-white shadow-purple">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-slate">{pillar.title}</h3>
                <p className="mt-3 font-body text-sm leading-7 text-gray-text">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="off-white" id="programs">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-[30px] font-bold text-slate md:text-[34px]">
            Programs offered
          </h2>
          <p className="mt-3 font-body text-sm leading-7 text-gray-text md:text-base">
            Choose the pathway that best fits your current season of growth and service.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl space-y-5">
          {programs.map((program) => (
            <div
              key={program.id}
              className="rounded-[28px] border border-gray-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:p-7"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-purple text-[10px] font-heading font-bold uppercase tracking-[1.5px] text-white px-3 py-1.5">
                      {program.id}
                    </span>
                    {program.shortName ? (
                      <span className="rounded-full bg-purple-light px-3 py-1.5 text-[10px] font-heading font-bold uppercase tracking-[1.5px] text-purple">
                        {program.shortName}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 font-heading text-xl font-bold text-slate">{program.name}</h3>
                  <p className="mt-3 font-body text-sm leading-7 text-gray-text">{program.desc}</p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full border border-purple-light bg-purple-light/50 px-4 py-2 font-heading text-[11px] font-semibold uppercase tracking-[1.4px] text-slate">
                      Duration: {program.duration}
                    </span>
                    <span className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 font-heading text-[11px] font-semibold uppercase tracking-[1.4px] text-slate">
                      Fee: {formatFee(program)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="shrink-0 text-sm"
                  onClick={() => openEnroll(program)}
                >
                  Enroll <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="white" id="calendar">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-gray-border bg-off-white p-6 md:p-8">
            <p className="font-heading text-xs font-semibold uppercase tracking-[1.8px] text-purple-vivid">
              Faculty support
            </p>
            <h2 className="mt-3 font-heading text-[28px] font-bold text-slate">Guided by seasoned voices</h2>
            <p className="mt-3 font-body text-sm leading-7 text-gray-text">
              KISOLAM faculty combines doctrinal strength, pastoral care, and practical ministry
              experience to guide learners with clarity and accountability.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {facultyRoles.map((role) => (
                <div
                  key={role}
                  className="rounded-[20px] border border-white bg-white p-5 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-light">
                    <User className="h-6 w-6 text-purple" />
                  </div>
                  <p className="mt-4 font-heading text-sm font-semibold text-slate">{role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-[linear-gradient(135deg,#0E0B1E_0%,#24183D_100%)] p-6 text-white shadow-xl md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Calendar className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[1.8px] text-white/60">
                  Academic rhythm
                </p>
                <h2 className="font-heading text-[28px] font-bold text-white">2026 calendar</h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {[
                {
                  title: "Session 1",
                  detail: "January to June 2026",
                },
                {
                  title: "Session 2",
                  detail: "July to December 2026",
                },
                {
                  title: "Application window",
                  detail: "Closes two weeks before each session begins",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm"
                >
                  <p className="font-heading text-sm font-semibold uppercase tracking-[1.6px] text-gold">
                    {item.title}
                  </p>
                  <p className="mt-2 font-body text-sm leading-7 text-white/75">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Modal
        isOpen={showModal}
        onClose={() => {
          if (step !== "processing") setShowModal(false);
        }}
        title={`Enroll - ${selectedProgram?.name || ""}`}
      >
        {step === "processing" ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple border-t-transparent" />
            <p className="font-body text-sm text-gray-text">Processing your enrollment...</p>
          </div>
        ) : (
          <form onSubmit={handleEnrollAndPay} className="space-y-4">
            <div className="rounded-[10px] bg-purple-light/40 px-4 py-3 text-sm">
              <p className="font-heading font-semibold text-slate">{selectedProgram?.name}</p>
              <p className="text-[12px] text-gray-text">Duration: {selectedProgram?.duration}</p>
              <p className="mt-1 font-heading text-[13px] font-bold text-purple">
                {selectedProgram?.feeType === "paid"
                  ? `Fee: ${selectedProgram?.feeCurrency}${(selectedProgram?.fee || 0).toLocaleString()}`
                  : "Fee varies per session. Enter the correct amount below."}
              </p>
            </div>

            <Input
              id="name"
              label="Full Name"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="+234..."
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            {selectedProgram?.feeType === "variable" && (
              <Input
                id="amount"
                label="Program Fee (NGN)"
                type="number"
                placeholder="Enter 0 for free, or the current session fee"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                required
                min="0"
              />
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="giving" className="flex-1 justify-center gap-2">
                <BadgeCheck size={15} />
                {selectedProgram?.feeType === "paid" || Number(customAmount) > 0
                  ? "Enroll and Pay"
                  : "Enroll Free"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
