'use client';

import { useState } from 'react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Globe, CheckCircle } from 'lucide-react';
import { cith } from '@/lib/api';
import { FadeIn } from '@/components/ui/Motion';

export default function EHubPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const location = [
        formData.get('city'),
        formData.get('country')
      ].filter(Boolean).join(', ');

      await cith.registerEhub({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        location: location,
      });
      setSubmitted(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error('Failed to register:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Section */}
      <section
        className="relative h-96 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0E0B1E] to-[#C9A84C]"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <FadeIn>
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
              Join the e-Hub
            </h1>
            <p className="font-body text-xl md:text-2xl text-[#FAFAF8]">
              Connect from anywhere in the world
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Form Section */}
      <SectionWrapper variant="white">
        <div className="mx-auto max-w-xl">
          <FadeIn>
            <div className="text-center mb-8">
              <Globe className="mx-auto h-12 w-12 text-[#C9A84C] mb-3" />
              <h2 className="font-heading text-3xl font-bold text-[#0E0B1E] mb-3">
                e-Hub Registration
              </h2>
              <p className="font-body text-sm text-[#8A8A90]">
                No physical hub nearby? Join our online community and participate
                in virtual fellowship meetings from anywhere in the world.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-lg bg-[#27AE60]/10 border border-[#27AE60]/30 p-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-[#27AE60] mb-4" />
                <h3 className="font-heading text-xl font-bold text-[#27AE60] mb-2">
                  Registration Successful!
                </h3>
                <p className="font-body text-sm text-[#8A8A90] mb-6">
                  Check your email for your virtual meeting schedule and links.
                  Welcome to the e-Hub community!
                </p>
                <Button
                  variant="primary"
                  onClick={() => setSubmitted(false)}
                  className="bg-[#C9A84C] hover:bg-[#0E0B1E]"
                >
                  Register Another Person
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                />
                <Input
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
                <Input
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                />
                <Input
                  id="country"
                  name="country"
                  label="Country"
                  placeholder="e.g. Nigeria"
                  required
                />
                <Input
                  id="city"
                  name="city"
                  label="City"
                  placeholder="e.g. Lagos"
                  required
                />
                <div>
                  <label htmlFor="referral" className="block text-sm font-heading font-bold text-[#0E0B1E] mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    id="referral"
                    name="referral"
                    className="w-full px-4 py-2 border border-[#E8E6F0] rounded-lg text-[#0E0B1E] font-body focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="friend">Friend or Family</option>
                    <option value="social">Social Media</option>
                    <option value="website">Website</option>
                    <option value="church">Church</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2 bg-[#C9A84C] hover:bg-[#0E0B1E]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Joining...' : 'Join the e-Hub'}
                </Button>
              </form>
            )}
          </FadeIn>
        </div>
      </SectionWrapper>
    </main>
  );
}
