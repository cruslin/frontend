"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { serviceSchedule } from "@/lib/api";

// Fallback if API is unreachable
const DEFAULT_SERVICES = [
  {
    day: "Sunday",
    name: "Word & Life Service",
    time: "8:00 AM",
    description: "Our flagship gathering — worship, the Word, and life application.",
  },
  {
    day: "Tuesday",
    name: "Prayer Service",
    time: "5:30 PM",
    description: "A time of corporate prayer, intercession, and spiritual warfare.",
  },
  {
    day: "Friday",
    name: "Worship Service",
    time: "5:30 PM",
    description: "An evening of deep worship and encounter with God's presence.",
  },
  {
    day: "1st — 3rd",
    dayLabel: "of every month",
    name: "As Unto The Lord",
    time: "6 AM & 6 PM",
    description: "Special consecration services to begin each month in God's presence.",
  },
];

export default function ServiceSchedule() {
  const [services, setServices] = useState(DEFAULT_SERVICES);

  useEffect(() => {
    serviceSchedule
      .getPublic()
      .then((data) => {
        if (data && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {
        // Use defaults on error
      });
  }, []);

  return (
    <SectionWrapper variant="dark-slate">
      <FadeIn>
        <SectionHeading
          eyebrow="When We Gather"
          title="A steady weekly rhythm of worship, prayer, and formation."
          description="Build your week around the moments where the house gathers to behold Christ, hear the Word, and pray together."
          align="center"
          className="mb-14"
          titleClassName="text-white"
        />
      </FadeIn>

      <StaggerContainer staggerDelay={0.1}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {services.map((service: any, i: number) => (
            <StaggerItem key={service.id || i}>
              <div className="group flex items-stretch overflow-hidden rounded-[30px] border border-white/[0.1] bg-white/[0.06] hover:border-gold/40 hover:bg-white/[0.1] transition-all duration-300">
                {/* Left: Day column */}
                <div className="w-24 sm:w-32 shrink-0 flex flex-col items-center justify-center py-5 px-2 sm:px-3 border-r border-white/[0.10]">
                  <span className="font-heading text-base sm:text-xl font-bold text-white leading-tight text-center">
                    {service.day}
                  </span>
                  {service.dayLabel && (
                    <span className="font-body text-[9px] sm:text-[10px] text-white/60 mt-0.5 text-center">
                      {service.dayLabel}
                    </span>
                  )}
                </div>

                {/* Middle: Name + Description */}
                <div className="flex-1 py-5 px-4 sm:px-6 min-w-0">
                  <h3 className="font-heading text-base sm:text-xl font-bold text-gold">
                    {service.name}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-white/80 mt-1.5 line-clamp-2 sm:line-clamp-none leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Right: Time */}
                <div className="shrink-0 flex items-center px-3 sm:px-6">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold" />
                    <span className="font-heading text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      {service.time}
                    </span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Subtle bottom accent */}
      <FadeIn delay={0.5}>
        <p className="mt-10 text-center font-serif text-sm italic text-white/30">
          Join us in fellowship
        </p>
      </FadeIn>
    </SectionWrapper>
  );
}
