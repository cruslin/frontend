"use client";

import { useState, useEffect } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { events as eventsAPI } from "@/lib/api";
import { SkeletonGroup } from "@/components/ui/Skeleton";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverLift,
} from "@/components/ui/Motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import EventCard from "@/components/ui/EventCard";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  slug?: string;
};

export default function EventsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsAPI.getEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load events"
        );
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const featuredEvents = [
    {
      id: "feast",
      title: "Feast of Tabernacles",
      description: "Join us for our annual spiritual celebration and communion gathering.",
      href: "/events/feast-of-tabernacles",
    },
    {
      id: "gilgal",
      title: "Gilgal Camp Meetings",
      description: "An immersive retreat experience for spiritual renewal and growth.",
      href: "/events/gilgal",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative min-h-[260px] sm:h-80 md:h-96 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <FadeIn className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
            Events & Programs
          </h1>
          <p className="font-body text-lg md:text-xl text-gray-100 mb-6">
            What's happening at the Embassy
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-purple to-purple-vivid mx-auto"></div>
        </FadeIn>
      </section>

      {/* Featured Events Section */}
      <SectionWrapper variant="white">
        <StaggerContainer>
          <StaggerItem>
            <h2 className="font-heading text-3xl font-bold text-slate mb-8">
              Featured
            </h2>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {featuredEvents.map((event) => (
                <HoverLift
                  key={event.id}
                  className="bg-gradient-to-r from-purple-dark to-purple rounded-xl p-8 text-white shadow-lg"
                >
                  <Link
                    href={event.href}
                    className="block group"
                  >
                    <h3 className="font-heading text-2xl font-bold mb-3 group-hover:text-lavender transition-colors">
                      {event.title}
                    </h3>
                    <p className="font-body text-gray-100 mb-6">
                      {event.description}
                    </p>
                    <div className="inline-flex items-center gap-2 font-body font-medium text-lavender group-hover:text-white transition-colors">
                      Learn More
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                </HoverLift>
              ))}
            </div>
          </StaggerItem>
        </StaggerContainer>
      </SectionWrapper>

      {/* All Events Section */}
      <SectionWrapper variant="off-white">
        <StaggerContainer>
          {/* Month Picker */}
          <StaggerItem>
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-12">
              <button
                onClick={() =>
                  setCurrentMonth((m) => (m === 0 ? 11 : m - 1))
                }
                className="text-gray-text hover:text-purple transition-colors p-3 rounded-full hover:bg-lavender"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate w-44 sm:w-64 text-center" suppressHydrationWarning>
                {months[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={() =>
                  setCurrentMonth((m) => (m === 11 ? 0 : m + 1))
                }
                className="text-gray-text hover:text-purple transition-colors p-3 rounded-full hover:bg-lavender"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </StaggerItem>

          {/* Loading State */}
          {loading && (
            <StaggerItem>
              <SkeletonGroup count={3} variant="card" />
            </StaggerItem>
          )}

          {/* Error State */}
          {error && !loading && (
            <StaggerItem>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-12">
                <p className="font-body text-red-700">
                  {error}. Please try again later.
                </p>
              </div>
            </StaggerItem>
          )}

          {/* Events Grid */}
          {!loading && events.length > 0 && (
            <StaggerItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => {
                  const eventDate = new Date(event.date);
                  const day = eventDate.getDate().toString();
                  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                  return (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      description={event.description}
                      date={event.date}
                      day={day}
                      month={month}
                      href={`/events/${event.slug || event.id}`}
                    />
                  );
                })}
              </div>
            </StaggerItem>
          )}

          {/* Empty State */}
          {!loading && events.length === 0 && !error && (
            <StaggerItem>
              <div className="text-center py-12">
                <p className="font-body text-gray-text text-lg">
                  No events scheduled for this month.
                </p>
              </div>
            </StaggerItem>
          )}
        </StaggerContainer>
      </SectionWrapper>
    </main>
  );
}
