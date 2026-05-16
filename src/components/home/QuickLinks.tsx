'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FeatureCard from '@/components/ui/FeatureCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const quickLinks = [
  {
    title: 'New Here?',
    subtitle: 'Start your journey',
    href: '/new-here',
    imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80',
  },
  {
    title: 'Give / Sow',
    subtitle: 'Tithes, offerings & seeds',
    href: '/give',
    imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
  },
  {
    title: 'Grow with Us',
    subtitle: 'Deepen your walk',
    href: '/grow',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  },
  {
    title: 'Latest Message',
    subtitle: 'Watch or listen',
    href: '/resources/video',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
  },
  {
    title: 'Events',
    subtitle: "What's happening",
    href: '/events',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
  },
  {
    title: 'Join a Squad',
    subtitle: 'Kingdom Life Squads',
    href: '/kingdom-expressions/squads',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  },
];

export default function QuickLinks() {
  return (
    <SectionWrapper variant="off-white" id="quick-links">
      <FadeIn>
        <SectionHeading
          eyebrow="Explore the House"
          title="Move through the life of the Embassy with clarity."
          description="Whether you are visiting for the first time, catching up on a message, or looking for your next community step, these pages get you there quickly."
          align="center"
          className="mb-12"
        />
      </FadeIn>

      <StaggerContainer>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <StaggerItem key={link.title}>
              <FeatureCard
                title={link.title}
                subtitle={link.subtitle}
                href={link.href}
                imageUrl={link.imageUrl}
              />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </SectionWrapper>
  );
}
