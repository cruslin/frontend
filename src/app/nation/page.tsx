"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { MessageCircle, Users, User } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import { nation, engagement, serviceSchedule, type Post } from "@/lib/api";
import CreatePost from "@/components/nation/CreatePost";
import PostCard from "@/components/nation/PostCard";
import { SkeletonGroup } from "@/components/ui/Skeleton";

const WEEKDAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

function nextOccurrence(day: string, time: string): Date | null {
  const trimmed = day.trim().replace(/s$/i, "");
  const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  const dayIndex = WEEKDAY_INDEX[normalized];
  const match = time.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (dayIndex === undefined || !match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  if (hours === 12) hours = 0;
  if (match[3].toUpperCase() === "PM") hours += 12;

  const now = new Date();
  const candidate = new Date(now);
  candidate.setHours(hours, minutes, 0, 0);
  let daysAhead = (dayIndex - now.getDay() + 7) % 7;
  if (daysAhead === 0 && candidate <= now) daysAhead = 7;
  candidate.setDate(now.getDate() + daysAhead);
  return candidate;
}

export default function NationPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [upcomingServices, setUpcomingServices] = useState<{ name: string; time: string; date: Date }[]>([]);

  useEffect(() => {
    loadFeed();
    loadGroups();
    loadStreak();
  }, [page]);

  useEffect(() => {
    serviceSchedule.getPublic().then((data) => {
      if (!data?.length) return;
      const now = new Date();
      const mapped = (data as any[])
        .filter((s) => s.active !== false)
        .map((s) => ({ name: s.name, time: s.time, date: nextOccurrence(s.day, s.time) }))
        .filter((s): s is { name: string; time: string; date: Date } => s.date !== null && s.date > now)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 3);
      setUpcomingServices(mapped);
    }).catch(() => {});
  }, []);

  async function loadFeed() {
    try {
      setLoading(true);
      const feed = await nation.getFeed(page + 1);
      setPosts(Array.isArray(feed) ? feed : []);
    } catch (err) {
      error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }

  async function loadGroups() {
    try {
      const groupsData = await nation.getGroups();
      setGroups((Array.isArray(groupsData) ? groupsData : []).slice(0, 4));
    } catch {
      // silent — sidebar is non-critical
    }
  }

  async function loadStreak() {
    try {
      const streakData = await engagement.getStreak();
      setStreak(streakData?.currentStreak ?? 0);
    } catch {
      // silent — widget is non-critical
    }
  }

  async function handleCreatePost(content: string, imageUrl?: string) {
    try {
      await nation.createPost({ content, imageUrl });
      success("Post created successfully!");
      setPosts([]);
      setPage(0);
      loadFeed();
    } catch (err) {
      error("Failed to create post");
    }
  }

  function handleLikePost(postId: string) {
    // PostCard already called the API internally; just sync parent state.
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes ?? 0) + 1 } : p));
  }

  return (
    <ProtectedRoute>
      <>
        {/* Hero */}
        <section className="relative flex items-center justify-center py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-dark to-purple" />
          <div className="absolute inset-0 bg-[rgba(14,0,22,0.84)]" />
          <div className="relative z-10 mx-auto max-w-[1200px] px-4 text-center sm:px-6 md:px-8">
            <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">
              Ecclesia Nation
            </h1>
            <h6 className="mt-2 font-serif text-base font-light text-off-white">
              Connect, share, and grow with the community
            </h6>
          </div>
        </section>

        <div className="bg-lavender min-h-screen">
          <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Sidebar */}
              <aside className="hidden lg:block space-y-4">
                <div className="rounded-[8px] bg-white border border-gray-border p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-light">
                      <User className="h-6 w-6 text-purple/50" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-bold text-slate">
                        {user?.profile?.firstName || "Member"}
                      </p>
                      <p className="text-[11px] text-gray-text">View Profile</p>
                    </div>
                  </div>
                  <nav className="space-y-1">
                    <Link
                      href="/nation/messages"
                      className="flex items-center gap-2 rounded-[4px] px-3 py-2 font-body text-sm text-slate hover:bg-lavender transition-colors"
                    >
                      <MessageCircle size={16} /> Messages
                    </Link>
                    <Link
                      href="/nation/groups"
                      className="flex items-center gap-2 rounded-[4px] px-3 py-2 font-body text-sm text-slate hover:bg-lavender transition-colors"
                    >
                      <Users size={16} /> Groups
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-[4px] px-3 py-2 font-body text-sm text-slate hover:bg-lavender transition-colors"
                    >
                      <User size={16} /> Dashboard
                    </Link>
                  </nav>
                </div>

                {/* Streak widget */}
                <div className="rounded-[8px] bg-white border border-gray-border p-4 shadow-sm text-center">
                  <p className="font-heading text-xs font-bold uppercase tracking-wider text-gray-text">
                    Watch Streak
                  </p>
                  <p className="mt-1 font-heading text-3xl font-bold text-purple">
                    {streak}
                  </p>
                  <p className="text-[11px] text-gray-text">days in a row</p>
                </div>
              </aside>

              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-4">
                <CreatePost onSubmit={handleCreatePost} />
                {loading ? (
                  <SkeletonGroup count={3} variant="card" />
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      {...post}
                      onLike={() => handleLikePost(post.id)}
                    />
                  ))
                )}
              </div>

              {/* Right sidebar */}
              <aside className="hidden lg:block space-y-4">
                {/* Trending / Active Groups */}
                <div className="rounded-[8px] bg-white border border-gray-border p-4 shadow-sm">
                  <h4 className="font-heading text-sm font-bold text-slate mb-3">
                    Active Groups
                  </h4>
                  <div className="space-y-2">
                    {groups.map((group) => (
                      <Link
                        key={group.id}
                        href="/nation/groups"
                        className="block rounded-[4px] px-3 py-2 font-body text-sm text-slate hover:bg-lavender transition-colors"
                      >
                        {group.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Upcoming */}
                <div className="rounded-[8px] bg-white border border-gray-border p-4 shadow-sm">
                  <h4 className="font-heading text-sm font-bold text-slate mb-3">
                    Upcoming
                  </h4>
                  <div className="space-y-3">
                    {upcomingServices.map((s) => (
                      <Link
                        key={s.name + s.date.toISOString()}
                        href="/live"
                        className="flex flex-col rounded-[4px] px-2 py-2 hover:bg-lavender transition-colors"
                      >
                        <span className="font-heading text-xs font-bold text-purple-vivid">
                          {format(s.date, "EEE, MMM d")} · {s.time}
                        </span>
                        <span className="font-body text-sm text-slate">
                          {s.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}
