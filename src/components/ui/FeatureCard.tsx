'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  href: string;
  className?: string;
}

export default function FeatureCard({
  title,
  subtitle,
  imageUrl,
  href,
  className,
}: FeatureCardProps) {
  return (
    <Link href={href}>
      <motion.div
        className={cn(
          "group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 cursor-pointer shadow-[0_24px_55px_rgba(14,11,30,0.08)]",
          className
        )}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      >
        {/* Background */}
        <div
          className={cn(
            "absolute inset-0",
            imageUrl ? "bg-cover bg-center" : "bg-purple-dark"
          )}
          style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.22),_transparent_32%),linear-gradient(180deg,_rgba(14,11,30,0.35)_0%,_rgba(14,11,30,0.82)_100%)] transition-transform duration-300 group-hover:scale-105" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-7 text-left">
          <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            Explore
          </p>
          <h3 className="mt-3 text-[30px] font-bold text-white font-heading leading-[1.05]">
            {title}
          </h3>
          <p className="mt-3 max-w-[18rem] font-body text-sm leading-6 text-off-white/84">{subtitle}</p>

          <div className="mt-8 flex items-center gap-2 text-off-white group/btn">
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em]">Open Page</span>
            <ArrowRight
              size={20}
              className="group-hover/btn:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="absolute inset-0 rounded-[28px] border border-white/6 pointer-events-none" />
      </motion.div>
    </Link>
  );
}
