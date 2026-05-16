"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { livestream, serviceSchedule } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";

interface LivestreamConfig {
  isLive?: boolean;
  embedUrl?: string;
  nextService?: string;
}

interface ServiceScheduleEntry {
  id?: string;
  day: string;
  dayLabel?: string;
  name: string;
  time: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
}

interface UpcomingService {
  name: string;
  startsAt: Date;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function normalizeWeekday(day: string) {
  const trimmedDay = day.trim().replace(/s$/i, "");
  const normalizedDay =
    trimmedDay.charAt(0).toUpperCase() + trimmedDay.slice(1).toLowerCase();

  return WEEKDAY_INDEX[normalizedDay] === undefined ? null : normalizedDay;
}

function toEmbedUrl(url?: string | null) {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/
  );

  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return `https://www.youtube.com/embed/${url}`;
  }

  return url;
}

function extractYoutubeVideoId(url?: string | null) {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );

  if (match?.[1]) {
    return match[1];
  }

  return /^[A-Za-z0-9_-]{11}$/.test(url) ? url : null;
}

function parseServiceTime(time: string) {
  const match = time.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);

  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const meridiem = match[3].toUpperCase();

  if (hours === 12) {
    hours = 0;
  }

  if (meridiem === "PM") {
    hours += 12;
  }

  return { hours, minutes };
}

function getRecurringServiceCandidates(
  services: ServiceScheduleEntry[],
  now: Date
) {
  return services
    .map((service) => {
      const normalizedDay = normalizeWeekday(service.day);
      const dayIndex =
        normalizedDay === null ? undefined : WEEKDAY_INDEX[normalizedDay];
      const parsedTime = parseServiceTime(service.time);

      if (dayIndex === undefined || !parsedTime) {
        return null;
      }

      const candidate = new Date(now);
      candidate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);

      let daysUntilService = (dayIndex - now.getDay() + 7) % 7;

      if (daysUntilService === 0 && candidate <= now) {
        daysUntilService = 7;
      }

      candidate.setDate(now.getDate() + daysUntilService);

      return {
        name: service.name,
        startsAt: candidate,
      } satisfies UpcomingService;
    })
    .filter((service): service is UpcomingService => service !== null);
}

function getNextUpcomingService(
  config: LivestreamConfig | null,
  services: ServiceScheduleEntry[],
  now: Date
) {
  const candidates = getRecurringServiceCandidates(services, now);

  if (config?.nextService) {
    const configuredDate = new Date(config.nextService);

    if (!Number.isNaN(configuredDate.getTime()) && configuredDate > now) {
      candidates.push({
        name: "Upcoming Service",
        startsAt: configuredDate,
      });
    }
  }

  return candidates.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())[0] ?? null;
}

function getCountdownParts(target: Date | null, now: Date) {
  if (!target) {
    return null;
  }

  const difference = Math.max(target.getTime() - now.getTime(), 0);

  const days = Math.floor(difference / 86_400_000);
  const hours = Math.floor((difference % 86_400_000) / 3_600_000);
  const minutes = Math.floor((difference % 3_600_000) / 60_000);
  const seconds = Math.floor((difference % 60_000) / 1_000);

  return { days, hours, minutes, seconds };
}

function LiveHeroSkeleton() {
  return (
    <section className="bg-slate pt-16 pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <Skeleton className="aspect-video w-full rounded-t-[20px] border-x-2 border-t-2 border-gold/20 bg-white/8" />
      </div>
    </section>
  );
}

export default function LivePage() {
  const [config, setConfig] = useState<LivestreamConfig | null>(null);
  const [services, setServices] = useState<ServiceScheduleEntry[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [youtubeIsLive, setYoutubeIsLive] = useState(false);
  const [youtubeLiveUrl, setYoutubeLiveUrl] = useState<string | null>(null);

  const lockedEmbedRef = useRef<string>("");
  const lockedStreamKeyRef = useRef<string>("");
  const [iframeSrc, setIframeSrc] = useState<string>("");

  useEffect(() => {
    document.title = "Live | The Ecclesia Embassy";

    let isMounted = true;

    const fetchConfig = async () => {
      try {
        const data = await livestream.getConfig();
        if (!isMounted) return;
        setConfig(data ?? {});
      } catch {
        if (!isMounted) return;
        setConfig({});
      } finally {
        if (isMounted) {
          setIsLoadingConfig(false);
        }
      }
    };

    const fetchServices = async () => {
      try {
        const data = await serviceSchedule.getPublic();
        if (!isMounted) return;
        setServices(data ?? []);
      } catch {
        if (!isMounted) return;
        setServices([]);
      } finally {
        if (isMounted) {
          setIsLoadingServices(false);
        }
      }
    };

    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/youtube-videos");
        const data = await res.json();
        if (!isMounted) return;
        setVideos(data.videos ?? []);
      } catch {
        if (!isMounted) return;
        setVideos([]);
      } finally {
        if (isMounted) {
          setIsLoadingVideos(false);
        }
      }
    };

    const fetchYoutubeLive = async () => {
      try {
        const res = await fetch("/api/youtube-live");
        const data = await res.json();
        if (!isMounted) return;
        setYoutubeIsLive(data.isLive ?? false);
        setYoutubeLiveUrl(data.embedUrl ?? null);
      } catch {
        // silent — defaults remain false/null
      }
    };

    fetchConfig();
    fetchServices();
    fetchVideos();
    fetchYoutubeLive();

    const configIntervalId = window.setInterval(fetchConfig, 30000);
    const youtubeLiveIntervalId = window.setInterval(fetchYoutubeLive, 60000);
    const clockIntervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      isMounted = false;
      window.clearInterval(configIntervalId);
      window.clearInterval(youtubeLiveIntervalId);
      window.clearInterval(clockIntervalId);
    };
  }, []);

  const manualEmbedUrl = toEmbedUrl(config?.embedUrl);
  const hasManualOverride = Boolean(config?.isLive && manualEmbedUrl);
  const liveEmbedUrl = hasManualOverride
    ? manualEmbedUrl
    : youtubeIsLive
      ? (youtubeLiveUrl ?? "")
      : "";
  const showLiveStream = Boolean(liveEmbedUrl);
  const activeVideoId = hasManualOverride
    ? extractYoutubeVideoId(manualEmbedUrl)
    : youtubeIsLive
      ? extractYoutubeVideoId(youtubeLiveUrl)
      : null;
  const archivedVideos = activeVideoId
    ? videos.filter((video) => video.id !== activeVideoId)
    : videos;

  useEffect(() => {
    const streamKey = hasManualOverride
      ? `manual:${liveEmbedUrl}`
      : activeVideoId
        ? `youtube:${activeVideoId}`
        : "";

    if (showLiveStream && liveEmbedUrl) {
      if (hasManualOverride) {
        if (lockedStreamKeyRef.current !== streamKey) {
          lockedStreamKeyRef.current = streamKey;
          lockedEmbedRef.current = liveEmbedUrl;
          setIframeSrc(liveEmbedUrl);
        }
      } else if (!lockedEmbedRef.current) {
        lockedStreamKeyRef.current = streamKey;
        lockedEmbedRef.current = liveEmbedUrl;
        setIframeSrc(liveEmbedUrl);
      }
    } else if (!showLiveStream && lockedEmbedRef.current) {
      lockedStreamKeyRef.current = "";
      lockedEmbedRef.current = "";
      setIframeSrc("");
    }
  }, [activeVideoId, hasManualOverride, liveEmbedUrl, showLiveStream]);

  const nextUpcomingService = getNextUpcomingService(config, services, now);
  const countdown = getCountdownParts(nextUpcomingService?.startsAt ?? null, now);
  const isLoadingHero = isLoadingConfig || isLoadingServices;

  return (
    <div className="w-full">
      {/* Stream hero */}
      {isLoadingHero ? (
        <LiveHeroSkeleton />
      ) : (
        <section className="relative bg-slate pt-16 pb-0">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
            <div className="relative aspect-video overflow-hidden rounded-t-[20px] border-x-2 border-t-2 border-gold/25 bg-black shadow-[0_30px_80px_rgba(9,7,26,0.5)]">
              {iframeSrc && (
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.28em] text-white">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  {hasManualOverride ? "Manual Live" : "Live Now"}
                </div>
              )}

              {iframeSrc ? (
                <iframe
                  src={iframeSrc}
                  title="The Ecclesia Embassy livestream"
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.22),_transparent_45%),linear-gradient(180deg,_#161129_0%,_#0E0B1E_100%)] px-6 text-center text-white">
                  <p className="mb-5 rounded-full border border-gold/35 bg-white/5 px-5 py-1.5 font-heading text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                    Next Service Countdown
                  </p>
                  <h2 className="font-heading text-3xl font-bold text-gold md:text-4xl">
                    {nextUpcomingService?.name ?? "We are offline"}
                  </h2>
                  <p className="mt-3 max-w-xl font-body text-sm text-white/68 md:text-base">
                    {nextUpcomingService
                      ? format(nextUpcomingService.startsAt, "EEEE, MMMM d 'at' h:mm a")
                      : "Check back during service hours for the next livestream."}
                  </p>

                  {countdown && (
                    <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { label: "Days", value: countdown.days },
                        { label: "Hours", value: countdown.hours },
                        { label: "Minutes", value: countdown.minutes },
                        { label: "Seconds", value: countdown.seconds },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[18px] border border-gold/20 bg-white/6 px-4 py-5 backdrop-blur-sm"
                        >
                          <p className="font-heading text-3xl font-bold text-white md:text-4xl">
                            {String(item.value).padStart(2, "0")}
                          </p>
                          <p className="mt-2 font-heading text-[11px] uppercase tracking-[0.22em] text-white/48">
                            {item.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Ecclesia Nation CTA */}
      <section className="bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.18),_transparent_42%),linear-gradient(180deg,_#161129_0%,_#0E0B1E_100%)] py-14">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8 text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Community
          </p>
          <h3 className="mt-4 font-heading text-2xl font-bold text-white md:text-3xl">
            Join the conversation in Ecclesia Nation
          </h3>
          <p className="mt-3 font-body text-sm text-white/60 max-w-lg mx-auto">
            Connect with the community between services — share, pray, and grow together.
          </p>
          <Link
            href="/nation"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 font-heading text-[13px] font-bold uppercase tracking-[0.15em] text-slate shadow-[0_14px_28px_rgba(201,168,76,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-dark"
          >
            Enter the Nation
          </Link>
        </div>
      </section>

      {/* Previous streams */}
      <section className="bg-[linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(250,250,248,0.96)_100%)] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="mb-12 text-center">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-purple-vivid">
              Archive
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-slate md:text-4xl">
              Previous Streams
            </h2>
          </div>

          {isLoadingVideos ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[24px] border border-[rgba(14,11,30,0.08)] bg-white shadow-sm"
                >
                  <Skeleton className="aspect-video w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3 w-2/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : archivedVideos.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {archivedVideos.map((video) => (
                <article
                  key={video.id}
                  className="soft-card overflow-hidden rounded-[24px] transition-transform duration-200 hover:-translate-y-1"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-lavender">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg">
                          <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="line-clamp-2 font-heading text-sm font-bold leading-6 text-slate">
                        {video.title}
                      </h3>
                      <p className="mt-2 font-body text-xs text-gray-text">
                        {video.publishedAt
                          ? format(new Date(video.publishedAt), "MMMM d, yyyy")
                          : "Date unavailable"}
                      </p>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center font-body italic text-gray-text">
              No previous streams found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
