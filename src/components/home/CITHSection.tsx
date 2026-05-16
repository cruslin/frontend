"use client";

import Link from "next/link";
import { MapPin, Globe, Home } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeIn, StaggerContainer, StaggerItem, HoverLift } from "@/components/ui/Motion";

export default function CITHSection() {
  const cards = [
    {
      icon: MapPin,
      title: "Find a Hub Near You",
      description: "Discover Church in the House gatherings in your community",
      cta: "Find a Hub",
      href: "/cith",
    },
    {
      icon: Globe,
      title: "Join the e-Hub",
      description: "Connect with our online Church in the House community",
      cta: "Join Online",
      href: "/cith/ehub",
    },
    {
      icon: Home,
      title: "Register Your Home as a Hub",
      description: "Open your home for fellowship and spiritual growth",
      cta: "Apply Now",
      href: "/cith/register",
    },
  ];

  return (
    <SectionWrapper variant="white">
      <div className="py-6 md:py-10">
        <FadeIn>
          <SectionHeading
            eyebrow="Belong Locally"
            title="Church in the House takes fellowship beyond Sunday."
            description="Our hubs gather believers by neighbourhood and rhythm, making prayer, accountability, hospitality, and discipleship feel personal."
            align="center"
            className="mb-12 md:mb-16"
          />
        </FadeIn>

        {/* Cards Grid */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <StaggerItem key={index}>
                  <HoverLift>
                    <Link href={card.href}>
                      <div className="soft-card rounded-[30px] p-8 text-center h-full flex flex-col items-center justify-center hover:-translate-y-1 transition-all duration-300">
                        {/* Icon */}
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-light">
                          <IconComponent className="h-8 w-8 text-purple" />
                        </div>

                        {/* Title */}
                        <h3 className="font-heading text-xl font-semibold text-slate mb-3">
                          {card.title}
                        </h3>

                        {/* Description */}
                        <p className="font-body text-gray-text mb-6 flex-grow">
                          {card.description}
                        </p>

                        {/* CTA */}
                        <span className="font-body font-semibold text-purple-vivid hover:underline transition-all duration-300">
                          {card.cta}
                        </span>
                      </div>
                    </Link>
                  </HoverLift>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>
    </SectionWrapper>
  );
}
