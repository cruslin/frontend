"use client";

import { useState, useEffect } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import { announcements as announcementsAPI } from "@/lib/api";
import { SkeletonGroup } from "@/components/ui/Skeleton";
import { FadeIn, StaggerContainer, StaggerItem, HoverLift } from "@/components/ui/Motion";

interface Announcement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  publishDate?: string;
  createdAt: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await announcementsAPI.getAnnouncements();
        setAnnouncements(data?.slice(0, 3) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load announcements");
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const formatDate = (announcement: Announcement) => {
    const dateStr = announcement.publishDate || announcement.createdAt;
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExcerpt = (announcement: Announcement) => {
    return announcement.content?.substring(0, 150) || "";
  };

  return (
    <SectionWrapper variant="lavender" id="announcements">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <SectionHeading
            eyebrow="Stay Current"
            title="News, updates, and moments worth noting."
            description="Catch the latest rhythm of the house, upcoming opportunities, and important community information in one place."
            className="mb-12"
          />
        </FadeIn>

        {/* Loading State */}
        {loading && (
          <SkeletonGroup count={3} variant="card" />
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-lg border border-purple-vivid bg-purple-50 px-6 py-8 text-center">
            <p className="font-body text-gray-text">{error}</p>
          </div>
        )}

        {/* Announcements Grid */}
        {!loading && announcements.length > 0 && (
          <StaggerContainer>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {announcements.map((announcement) => (
                <StaggerItem key={announcement.id}>
                  <HoverLift>
                    <div className="flex h-full flex-col rounded-[28px] border border-slate/6 bg-white p-6 shadow-[0_20px_46px_rgba(14,11,30,0.08)] transition-shadow duration-200 hover:shadow-[0_24px_54px_rgba(14,11,30,0.12)]">
                      {/* Date */}
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-purple-vivid">
                        {formatDate(announcement)}
                      </p>

                      {/* Title */}
                      <h3 className="mt-4 text-xl font-bold text-slate">
                        {announcement.title}
                      </h3>

                      {/* Content */}
                      <p className="mt-2 flex-grow line-clamp-4 font-body text-sm text-gray-text leading-relaxed">
                        {getExcerpt(announcement)}
                      </p>
                    </div>
                  </HoverLift>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}

        {/* Empty State */}
        {!loading && announcements.length === 0 && !error && (
          <div className="rounded-lg bg-white px-6 py-12 text-center shadow-sm">
            <p className="font-body text-gray-text">
              No announcements at this time. Check back soon for updates!
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
