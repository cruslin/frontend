"use client";

import { useRouter } from "next/navigation";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { Globe, Target, BookOpen, Check } from "lucide-react";
import { squads } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";

export default function KIPPage() {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await squads.registerKIP({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
      });
      success("Welcome to the Kingdom Influencing Platform!");
      setRegistered(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="relative flex items-center justify-center py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-dark to-purple" />
        <div className="absolute inset-0 bg-[rgba(14,0,22,0.84)]" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 text-center sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-bold text-white md:text-[42px] md:leading-[48px]">
            Kingdom Influence Platforms
          </h1>
          <h6 className="mt-3 font-serif text-lg font-light text-off-white">
            Transforming systems and spheres of civilization through Kingdom influence
          </h6>
        </div>
      </section>

      <SectionWrapper variant="white">
        <div className="mx-auto max-w-3xl space-y-10">
          <div className="text-center">
            <h2 className="font-heading text-[28px] font-bold text-slate">About KIP</h2>
            <p className="mt-3 font-heading text-base font-semibold text-[#C9A84C] tracking-wide">
              Raising Kingdom Voices. Shaping Systems. Advancing God&rsquo;s Agenda.
            </p>
          </div>

          <div className="space-y-4 font-body text-base text-gray-text leading-relaxed">
            <p>
              The <span className="font-semibold text-slate">Kingdom Influencing Platform (KIP)</span>, a tier of
              the Ecclesia Embassy, is a movement committed to raising and equipping Kingdom ambassadors who carry
              the culture of Heaven into every sphere of society.
            </p>
            <p>
              We exist to ensure that believers do not merely exist within the world&rsquo;s systems — but transform
              them through Kingdom principles, divine wisdom, and unwavering devotion to God.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-[8px] bg-off-white border border-gray-border p-6">
              <h3 className="font-heading text-base font-bold text-slate mb-3">Our Vision</h3>
              <p className="font-body text-sm text-gray-text leading-relaxed">
                To seek God by raising and equipping Kingdom ambassadors who influence every sphere of society —
                shining as lights in the world while upholding God&rsquo;s standards.
              </p>
            </div>
            <div className="rounded-[8px] bg-off-white border border-gray-border p-6">
              <h3 className="font-heading text-base font-bold text-slate mb-3">Our Philosophy</h3>
              <p className="font-body text-sm text-gray-text leading-relaxed">
                We are in this world — but we are not of it. We engage systems — business, governance, education,
                media — not to blend in, but to shift culture. Our identity is anchored in the Kingdom of God.
              </p>
              <p className="mt-3 font-heading text-sm font-semibold text-slate">
                We do not conform. We transform.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-base font-bold text-slate mb-4">Our Mission</h3>
            <p className="font-body text-sm text-gray-text mb-4 leading-relaxed">
              We are intentional about raising believers who:
            </p>
            <ul className="space-y-3">
              {[
                "Engage the world's systems without losing their Kingdom identity",
                "Are strategically positioned for societal transformation",
                "Operate by divine wisdom, not worldly philosophy",
                "Discern and overcome forces that oppose Kingdom influence",
                "Function from a place of reverence for God and deep love for Him",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                  <span className="font-body text-sm text-gray-text leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[8px] bg-slate p-6 text-center">
            <p className="font-body text-base text-white/80 leading-relaxed mb-3">
              We are not raising passive believers.
            </p>
            <p className="font-body text-base text-white/80 leading-relaxed">
              We are raising <span className="font-semibold text-white">disciplined, discerning, and dangerous Kingdom operators</span> —
              men and women who can step into systems and shift them, establish righteousness, and advance God&rsquo;s agenda on the earth.
            </p>
            <p className="mt-4 font-heading text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              What We Are Building
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="dark-purple">
        <div className="mx-auto max-w-md text-center">
          <h2 className="font-heading text-[28px] font-bold text-white mb-6">Join the Platform</h2>
          {authLoading ? (
            <div className="text-center py-8">
              <p className="font-body text-sm text-white/70">Loading...</p>
            </div>
          ) : !isAuthenticated ? (
            <div className="rounded-[8px] bg-white/10 p-6">
              <p className="font-body text-sm text-white/70 mb-4">
                You must be logged in to join the Kingdom Influencing Platform.
              </p>
              <a href="/auth/login" className="text-purple-light font-heading font-semibold hover:underline">
                Log in to continue
              </a>
            </div>
          ) : registered ? (
            <div className="rounded-[8px] bg-white/10 p-8">
              <Check className="mx-auto h-10 w-10 text-success mb-3" />
              <h3 className="font-heading text-lg font-bold text-white">Welcome Aboard!</h3>
              <p className="mt-2 font-body text-sm text-white/70">You have been registered for the Kingdom Influencing Platform.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input id="name" name="name" placeholder="Full Name" required />
              <Input id="email" name="email" type="email" placeholder="Email Address" required />
              <Input id="phone" name="phone" type="tel" placeholder="Phone Number" required />
              <Input id="sphere" name="sphere" placeholder="Sphere of Influence (e.g. Education, Media)" required />
              <Button type="submit" variant="giving" className="w-full" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          )}
        </div>
      </SectionWrapper>
    </>
  );
}
