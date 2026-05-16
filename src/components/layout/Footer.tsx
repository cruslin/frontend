"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn, ShimmerLine } from "@/components/ui/Motion";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Events", href: "/events" },
  { label: "Livestream", href: "/live" },
  { label: "Give", href: "/give" },
];

const nextSteps = [
  { label: "Plan Your Visit", href: "/new-here" },
  { label: "Grow with Us", href: "/grow" },
  { label: "Find a Hub", href: "/cith" },
  { label: "Join a Squad", href: "/kingdom-expressions/squads" },
  { label: "Prayer Request", href: "/prayer" },
  { label: "Share Testimony", href: "/testimonies" },
];

const contactDetails = [
  {
    icon: MapPin,
    label: "Address",
    value: "Sarki Tafida Street, Guzape Hills, Asokoro, Abuja",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 803 400 7867",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@theecclesia.org",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.16),_transparent_30%),linear-gradient(180deg,_#120F20_0%,_#09071A_100%)] py-18 text-white">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1.25fr_0.9fr_0.9fr_1.1fr]">
          <FadeIn direction="up">
            <div className="max-w-sm">
              <Image
                src="/Logo.png"
                alt="The Ecclesia Embassy"
                width={240}
                height={68}
                className="h-[58px] w-auto object-contain"
              />
              <p className="mt-6 font-serif text-xl italic text-white/78">
                Word, Kingdom and Worship.
              </p>
              <p className="mt-4 font-body text-sm leading-7 text-white/62">
                A worshipping, praying, Scripture-shaped community in Abuja committed to
                raising Word-cultured ambassadors who carry Christ into every sphere.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/62">
                <Heart className="h-4 w-4 text-gold" fill="currentColor" />
                Built for the Kingdom
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <div>
              <h4 className="font-heading text-sm font-bold uppercase tracking-[0.24em] text-gold">
                Explore
              </h4>
              <ul className="mt-5 space-y-3">
                {siteLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-body text-sm text-white/74 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div>
              <h4 className="font-heading text-sm font-bold uppercase tracking-[0.24em] text-gold">
                Next Steps
              </h4>
              <ul className="mt-5 space-y-3">
                {nextSteps.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-body text-sm text-white/74 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <div>
              <h4 className="font-heading text-sm font-bold uppercase tracking-[0.24em] text-gold">
                Gather With Us
              </h4>
              <div className="mt-5 rounded-[28px] border border-white/10 bg-white/6 p-5">
                <div className="space-y-4">
                  <div>
                    <p className="font-heading text-xs uppercase tracking-[0.18em] text-white/42">
                      Weekly Rhythm
                    </p>
                    <p className="mt-2 font-body text-sm text-white/74">Sunday Worship · 8:00 AM</p>
                    <p className="font-body text-sm text-white/74">Tuesday Prayer · 5:30 PM</p>
                    <p className="font-body text-sm text-white/74">Friday Worship · 5:30 PM</p>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-4">
                    {contactDetails.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div key={item.label} className="flex gap-3">
                          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-gold">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-heading text-[11px] uppercase tracking-[0.18em] text-white/42">
                              {item.label}
                            </p>
                            <p className="mt-1 font-body text-sm text-white/74">{item.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <ShimmerLine className="mx-auto mb-6 mt-14 w-full max-w-sm" />

        <FadeIn direction="none" delay={0.35}>
          <div className="flex flex-col gap-3 text-center text-xs text-white/46 md:flex-row md:items-center md:justify-between md:text-left">
            <p suppressHydrationWarning>&copy; {year} The Ecclesia Embassy. All rights reserved.</p>
            <p>Raising Word-cultured ambassadors in Abuja and beyond.</p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
