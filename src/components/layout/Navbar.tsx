"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { buttonClasses } from "@/components/ui/button-styles";

const navLinks = [
  { label: "HOME", href: "/" },
  {
    label: "ABOUT US",
    href: "/about",
    children: [
      { label: "Our Vision", href: "/about" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "The Ecclesia Experience", href: "/about/experience" },
    ],
  },
  {
    label: "RESOURCES",
    href: "/resources",
    children: [
      { label: "Audio Archive", href: "/resources/audio" },
      { label: "Video Messages", href: "/resources/video" },
      { label: "Ecclesia Library", href: "/resources/library" },
      { label: "Ecclesia Music", href: "/resources/music" },
    ],
  },
  {
    label: "PROGRAMS",
    href: "/events",
    children: [
      { label: "Events Calendar", href: "/events" },
      { label: "Feast of Tabernacles", href: "/events/feast-of-tabernacles" },
      { label: "Gilgal Camp Meetings", href: "/events/gilgal" },
      { label: "As Unto The Lord", href: "/events/as-unto-the-lord" },
    ],
  },
  { label: "LIVESTREAM", href: "/live" },
  { label: "ECCLESIA NATION", href: "/nation" },
  {
    label: "GROW",
    href: "/grow",
    children: [
      { label: "Grow with Us", href: "/grow" },
      { label: "Church in the House", href: "/cith" },
      { label: "Intentionality Class", href: "/grow/intentionality-class" },
    ],
  },
  {
    label: "KINGDOM EXPRESSIONS",
    href: "/kingdom-expressions",
    children: [
      { label: "Kingdom Life Squads", href: "/kingdom-expressions/squads" },
      { label: "Kingdom Influencing Platform", href: "/kingdom-expressions/kip" },
    ],
  },
  {
    label: "TRAINING",
    href: "/training",
    children: [
      { label: "TEMA", href: "/training/tema" },
      { label: "KISOLAM", href: "/training/kisolam" },
      { label: "EIS", href: "/training/eis" },
    ],
  },
  { label: "CONTACT", href: "/contact" },
];

const utilityLinks = [
  { label: "Plan Your Visit", href: "/new-here" },
  { label: "Watch Live", href: "/live" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const closeMenus = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    const handlePointerDown = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        event.target instanceof Node &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Utility top bar */}
      <div className="relative z-[70] border-b border-white/10 bg-charcoal text-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-2.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-white/58">
            <span>Sunday Worship 8:00 AM</span>
            <span className="hidden text-white/16 lg:inline">|</span>
            <span>Tuesday Prayer 5:30 PM</span>
            <span className="hidden text-white/16 lg:inline">|</span>
            <span>Friday Worship 5:30 PM</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={cn(
                  "rounded-full border border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72",
                  "hover:border-gold/50 hover:bg-white/5 hover:text-gold"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main sticky header */}
      <header
        className={cn(
          "sticky top-0 z-[60] border-b border-white/8 bg-slate/92 backdrop-blur-xl transition-all duration-300",
          scrolled && "shadow-[0_18px_40px_rgba(9,7,26,0.25)]"
        )}
      >
        {/* Row 1: Logo + CTA + Mobile toggle */}
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
          <div className="flex min-h-[72px] items-center justify-between gap-4 lg:min-h-[64px]">
            <Link href="/" className="flex shrink-0 items-center" onClick={closeMenus}>
              <Image
                src="/Logo.png"
                alt="The Ecclesia Embassy"
                width={340}
                height={96}
                priority
                className="h-[46px] w-auto object-contain md:h-[54px]"
              />
            </Link>

            {/* Desktop: Sign In + Give/Sow */}
            <div className="hidden items-center gap-3 lg:flex">
              {!user ? (
                <>
                  <Link
                    href="/auth/login"
                    onClick={closeMenus}
                    className="rounded-full px-3 py-2 text-sm font-medium text-white/70 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/give"
                    onClick={closeMenus}
                    className={buttonClasses({ variant: "primary" })}
                  >
                    Give / Sow
                  </Link>
                </>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-white/86 hover:bg-white/10"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-slate">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-heading text-xs uppercase tracking-[0.18em] text-white/52">
                        Account
                      </p>
                      <p className="font-body text-sm">
                        {user.profile?.firstName || "Member"}
                      </p>
                    </div>
                    <ChevronDown size={14} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-[26px] border border-slate/10 bg-white p-2 shadow-[0_28px_60px_rgba(14,11,30,0.16)]"
                      >
                        <div className="border-b border-slate/8 px-4 py-3">
                          <p className="font-heading text-sm font-semibold text-slate">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </p>
                          <p className="font-body text-xs text-gray-text">{user.email}</p>
                        </div>

                        {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") ? (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="mt-2 flex items-center gap-2 rounded-2xl px-4 py-3 font-body text-sm text-slate hover:bg-lavender"
                          >
                            <Shield size={14} /> Admin Dashboard
                          </Link>
                        ) : null}

                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="mt-1 flex items-center gap-2 rounded-2xl px-4 py-3 font-body text-sm text-slate hover:bg-lavender"
                        >
                          <LayoutDashboard size={14} /> My Dashboard
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            window.location.href = "/";
                          }}
                          className="mt-2 flex w-full items-center gap-2 rounded-2xl px-4 py-3 font-body text-sm text-error hover:bg-error/6"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Row 2: Nav links — desktop only */}
        <div className="hidden border-t border-white/8 lg:block">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
            <nav className="flex items-center justify-center gap-0.5 py-1.5">
              {navLinks.map((link) => {
                const active =
                  isActivePath(pathname, link.href) ||
                  link.children?.some((child) => isActivePath(pathname, child.href));

                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpenDropdown(null)}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-3 py-2 font-heading text-[11px] font-bold uppercase tracking-[0.08em]",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/72 hover:bg-white/6 hover:text-white"
                      )}
                    >
                      {link.label}
                      {link.children ? (
                        <motion.span
                          animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <ChevronDown size={11} />
                        </motion.span>
                      ) : null}
                    </Link>

                    <AnimatePresence>
                      {link.children && openDropdown === link.label ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute left-1/2 top-full z-50 mt-2 w-[min(280px,90vw)] -translate-x-1/2 rounded-[26px] border border-white/10 bg-[#171126]/95 p-3 shadow-[0_30px_60px_rgba(9,7,26,0.34)] backdrop-blur-xl"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                              className={cn(
                                "block rounded-2xl px-4 py-3 font-body text-sm text-white/74",
                                isActivePath(pathname, child.href)
                                  ? "bg-white/10 text-white"
                                  : "hover:bg-white/6 hover:text-white"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {mobileOpen ? (
          <div className="fixed inset-0 z-[120] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#09071A]/78 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="absolute right-0 top-0 flex h-full w-[min(360px,92vw)] flex-col overflow-y-auto bg-[linear-gradient(180deg,_#171126_0%,_#0E0B1E_100%)] p-6 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/8 pb-5">
                <Image
                  src="/Logo.png"
                  alt="The Ecclesia Embassy"
                  width={180}
                  height={52}
                  className="h-[40px] w-auto object-contain"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 rounded-[28px] border border-white/10 bg-white/6 p-5">
                <p className="font-heading text-xs uppercase tracking-[0.28em] text-gold">
                  This Week
                </p>
                <div className="mt-3 space-y-2 font-body text-sm text-white/74">
                  <p>Sunday Worship Service — 8:00 AM</p>
                  <p>Tuesday Prayer Service — 5:30 PM</p>
                  <p>Friday Worship Service — 5:30 PM</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/new-here"
                  onClick={closeMenus}
                  className={buttonClasses({ variant: "primary", className: "w-full" })}
                >
                  Plan Your Visit
                </Link>
                <Link
                  href="/give"
                  onClick={closeMenus}
                  className={buttonClasses({
                    variant: "secondary",
                    onDark: true,
                    className: "w-full",
                  })}
                >
                  Give / Sow
                </Link>
              </div>

              <div className="mt-8 space-y-2">
                {navLinks.map((link) => {
                  const active =
                    isActivePath(pathname, link.href) ||
                    link.children?.some((child) => isActivePath(pathname, child.href));

                  return (
                    <div
                      key={link.label}
                      className="rounded-[28px] border border-white/6 bg-white/4 px-4 py-4"
                    >
                      <Link
                        href={link.href}
                        onClick={!link.children ? closeMenus : undefined}
                        className={cn(
                          "flex items-center justify-between text-nav-link",
                          active ? "text-gold" : "text-white"
                        )}
                      >
                        <span>{link.label}</span>
                        {link.children ? <ChevronDown size={14} className="text-white/50" /> : null}
                      </Link>
                      {link.children ? (
                        <div className="mt-3 space-y-1 border-t border-white/8 pt-3">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeMenus}
                              className={cn(
                                "block rounded-2xl px-3 py-2 font-body text-sm",
                                isActivePath(pathname, child.href)
                                  ? "bg-white/10 text-white"
                                  : "text-white/68"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                {user ? (
                  <div className="space-y-3">
                    <p className="font-body text-sm text-white/70">
                      Signed in as {user.profile?.firstName || "Member"}
                    </p>
                    <Link
                      href="/dashboard"
                      onClick={closeMenus}
                      className="block rounded-2xl bg-white/6 px-4 py-3 font-body"
                    >
                      Open Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        window.location.href = "/";
                      }}
                      className="w-full rounded-2xl border border-white/10 px-4 py-3 text-left font-body text-white/72"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={closeMenus}
                    className="block rounded-2xl bg-white/6 px-4 py-3 font-body text-white"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
