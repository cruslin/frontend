'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion';
import { buttonClasses } from '@/components/ui/button-styles';
import { MapPin, Clock, Shirt, Heart, CheckCircle } from 'lucide-react';
import { firstTimer } from '@/lib/api';

const expectCards = [
  {
    icon: Heart,
    title: "Warm Welcome",
    description: "You'll be greeted warmly by our community. We're here to make you feel at home from the moment you arrive.",
  },
  {
    icon: Shirt,
    title: "Come As You Are",
    description: "There's no dress code. Just bring yourself and an open heart — God meets us where we are.",
  },
  {
    icon: Clock,
    title: "Service Times",
    description: "Sunday Worship at 8:00 AM. Join us for worship, the Word, and genuine community.",
  },
  {
    icon: MapPin,
    title: "Our Location",
    description: "Sarki Tafida Street, Guzape Hills, Asokoro, Abuja. We look forward to welcoming you in person.",
  },
];

export default function NewHerePage() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    source: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await firstTimer.submitFirstTimer({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        source: formData.source || 'website',
      });
      setIsSuccess(true);
      success('Welcome! Thank you for sharing your details. We look forward to meeting you!');

      setTimeout(() => {
        setFormData({ fullName: '', email: '', phone: '', source: '' });
        setIsSuccess(false);
      }, 3000);
    } catch {
      error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-bands">
      <PageHero
        eyebrow="New Here?"
        title="Welcome to The Ecclesia Embassy."
        subtitle="We're glad you're here."
        description="Whether this is your first Sunday or your first step toward a deeper faith community — you are welcome. Let us know you're coming and we'll be ready for you."
        backgroundImage="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1920&q=80"
        actions={[
          { href: "#plan", label: "Tell Us You're Coming", variant: "primary" },
          { href: "/contact", label: "Get in Touch", variant: "secondary", onDark: true },
        ]}
      />

      {/* What to expect */}
      <SectionWrapper variant="white">
        <SectionHeading
          eyebrow="What to Expect"
          title="We want you to feel at home."
          description="We want you to feel comfortable from the moment you walk through our doors. Here's what a Sunday looks like."
          align="center"
          className="mx-auto mb-14"
        />

        <StaggerContainer>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {expectCards.map((card) => {
              const Icon = card.icon;

              return (
                <StaggerItem key={card.title}>
                  <article className="soft-card rounded-[30px] p-7 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-light">
                      <Icon className="h-6 w-6 text-purple-vivid" />
                    </div>
                    <h3 className="mt-6 font-heading text-lg font-bold text-slate">{card.title}</h3>
                    <p className="mt-3 font-body text-sm leading-7 text-gray-text">{card.description}</p>
                  </article>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </SectionWrapper>

      {/* First-timer form */}
      <SectionWrapper variant="lavender" id="plan">
        <div className="mx-auto max-w-xl">
          <FadeIn>
            {!isSuccess ? (
              <>
                <SectionHeading
                  eyebrow="Plan Your Visit"
                  title="Tell us about yourself."
                  description="Help us get to know you so we can serve you well when you arrive."
                  align="center"
                  className="mx-auto mb-10"
                />

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="+234..."
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                      How did you hear about us?
                    </label>
                    <Select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      placeholder="Select an option"
                      options={[
                        { value: 'social-media', label: 'Social Media' },
                        { value: 'friend-family', label: 'Friend / Family' },
                        { value: 'website', label: 'Website' },
                        { value: 'walk-in', label: 'Walk-in' },
                        { value: 'other', label: 'Other' },
                      ]}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 w-full"
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-purple-light">
                  <CheckCircle className="h-10 w-10 text-purple-vivid" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-slate">
                  Welcome to our family!
                </h3>
                <p className="mt-3 font-body text-gray-text">
                  Thank you for sharing your details. We look forward to meeting you on Sunday!
                </p>
              </div>
            )}
          </FadeIn>
        </div>
      </SectionWrapper>

      {/* New Convert CTA */}
      <SectionWrapper variant="dark-purple">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <Heart className="h-6 w-6 text-gold" />
            </div>
            <SectionHeading
              eyebrow="Just Said Yes to Jesus?"
              title="Just gave your life to Christ?"
              description="Congratulations! We want to walk with you on this new journey. Fill out our New Convert form so we can connect you to a growth track, a squad, and a community hub near you."
              align="center"
              className="mx-auto"
              titleClassName="text-white"
            />
            <Link
              href="/new-here/new-convert"
              className={buttonClasses({ variant: "primary", className: "mt-8" })}
            >
              Start Your Journey
            </Link>
          </div>
        </FadeIn>
      </SectionWrapper>
    </main>
  );
}
