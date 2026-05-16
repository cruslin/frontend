"use client";

import PageHero from "@/components/ui/PageHero";

export default function HeroSection() {
  return (
    <PageHero
      eyebrow="Welcome Home"
      title="A house for worship, the Word, and Kingdom formation."
      subtitle="Word, Kingdom and Worship."
      description="Join a praying, Scripture-shaped community in Abuja where believers are discipled deeply, friendships are formed intentionally, and every gathering points us back to Christ."
      backgroundImage="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80"
      actions={[
        { href: "/new-here", label: "Plan Your Visit", variant: "primary" },
        { href: "/live", label: "Watch Live", variant: "secondary", onDark: true },
      ]}
      stats={[
        { value: "Sun 8AM", label: "Word and Life Service" },
        { value: "Tue 5:30PM", label: "Prayer Service" },
        { value: "Fri 5:30PM", label: "Worship Gathering" },
      ]}
      className="min-h-[88vh]"
    />
  );
}
