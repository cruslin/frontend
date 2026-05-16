"use client";

import { motion, Variants, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

/* ============================================
   THE ECCLESIA EMBASSY — Animation System
   Reusable Framer Motion Components
   ============================================ */

// ---- Shared transition presets ----
const springSmooth = { type: "spring" as const, stiffness: 80, damping: 20 };
const easeOut = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
const easeOutSlow = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

// ---- Fade In (basic reveal) ----
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className,
  direction = "up",
  distance = 30,
  once = true,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionMap[direction] }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ---- Stagger Children ----
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.12,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

// ---- Stagger Item (use inside StaggerContainer) ----
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export function StaggerItem({ children, className, direction = "up" }: StaggerItemProps) {
  const dirMap = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
  };

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...dirMap[direction] },
        visible: { opacity: 1, x: 0, y: 0, transition: easeOut },
      }}
    >
      {children}
    </motion.div>
  );
}

// ---- Scale In (for cards, icons) ----
interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function ScaleIn({ children, delay = 0, className, once = true }: ScaleInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{ ...springSmooth, delay }}
    >
      {children}
    </motion.div>
  );
}

// ---- Animated Counter ----
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  className,
  duration = 2,
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {prefix}
      <motion.span>
        {isInView ? value : 0}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

// ---- Page Transition Wrapper ----
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ---- Hero Text Animation ----
interface HeroTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function HeroText({ children, className, delay = 0 }: HeroTextProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...easeOutSlow, delay }}
    >
      {children}
    </motion.div>
  );
}

// ---- Parallax Background (subtle) ----
interface ParallaxBgProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxBg({ children, className, speed = 0.3 }: ParallaxBgProps) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ---- Hover Lift (for interactive cards) ----
interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  lift?: number;
}

export function HoverLift({ children, className, lift = -4 }: HoverLiftProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: lift, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

// ---- Shimmer / Glow Line ----
export function ShimmerLine({ className }: { className?: string }) {
  return (
    <motion.div
      className={`h-[2px] bg-gradient-to-r from-transparent via-purple-vivid to-transparent ${className || ""}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
    />
  );
}

// ---- Floating element (subtle bob animation) ----
export function Float({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
