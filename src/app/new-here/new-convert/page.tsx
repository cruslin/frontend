"use client";

import { useState, useEffect } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import {
  Heart,
  BookOpen,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { firstTimer, squads, cith } from "@/lib/api";

export default function NewConvertPage() {
  const { success, error } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [squadList, setSquadList] = useState<any[]>([]);
  const [hubList, setHubList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredSquad: "",
    preferredHub: "",
  });

  useEffect(() => {
    squads
      .getSquads()
      .then((data) => setSquadList(data || []))
      .catch(() => {});
    cith
      .getHubs()
      .then((data) => setHubList((data || []).filter((h: any) => h.status === "ACTIVE")))
      .catch(() => {});
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await firstTimer.submitNewConvert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredSquad: formData.preferredSquad || undefined,
        preferredHub: formData.preferredHub || undefined,
      });
      setIsSuccess(true);
      success("Welcome to the family! Your journey with us has begun.");
    } catch (err) {
      error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-dark to-purple" />
        <div className="absolute inset-0 bg-[rgba(14,0,22,0.84)]" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 text-center sm:px-6 md:px-8">
          <FadeIn>
            <h1 className="font-heading text-4xl font-bold text-white md:text-[48px] md:leading-[54px]">
              Welcome to the Family
            </h1>
            <p className="mt-4 font-serif text-lg font-light text-off-white max-w-2xl mx-auto">
              You have made the most important decision of your life. We are here
              to walk with you every step of the way.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Welcome Video */}
      <SectionWrapper variant="off-white">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="font-heading text-3xl font-bold mb-3"
              style={{ color: "#0E0B1E" }}
            >
              A Message For You
            </h2>
            <p className="font-body text-sm text-gray-text mb-6">
              Watch this short message as you begin your journey with us.
            </p>
            <div className="relative w-full overflow-hidden rounded-[8px] shadow-lg" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/K5S6n9czMYU?autoplay=1&mute=1&rel=0"
                title="Welcome Message"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </FadeIn>
      </SectionWrapper>

      {/* Growth Journey Overview */}
      <SectionWrapper variant="white">
        <FadeIn>
          <h2
            className="font-heading text-3xl font-bold text-center mb-4"
            style={{ color: "#0E0B1E" }}
          >
            Your Growth Journey
          </h2>
          <p className="font-body text-center text-gray-text mb-12 max-w-2xl mx-auto">
            As a new member of The Ecclesia Embassy, we want to make sure you are
            grounded, connected, and growing in the Word. Here is what we have
            prepared for you:
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StaggerItem>
            <div
              className="p-8 rounded-lg text-center transition-all duration-300 hover:shadow-lg h-full"
              style={{ backgroundColor: "#E8E6F0" }}
            >
              <div className="flex justify-center mb-4">
                <BookOpen size={40} style={{ color: "#C9A84C" }} />
              </div>
              <h3
                className="font-heading text-lg font-bold mb-2"
                style={{ color: "#0E0B1E" }}
              >
                Foundation Class
              </h3>
              <p className="font-body text-sm text-gray-text">
                A structured course to ground you in the basics of faith,
                doctrine, and the Christian walk.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div
              className="p-8 rounded-lg text-center transition-all duration-300 hover:shadow-lg h-full"
              style={{ backgroundColor: "#E8E6F0" }}
            >
              <div className="flex justify-center mb-4">
                <Heart size={40} style={{ color: "#C9A84C" }} />
              </div>
              <h3
                className="font-heading text-lg font-bold mb-2"
                style={{ color: "#0E0B1E" }}
              >
                Discipleship
              </h3>
              <p className="font-body text-sm text-gray-text">
                You will be paired with a mentor who will guide you through your
                early walk with Christ.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div
              className="p-8 rounded-lg text-center transition-all duration-300 hover:shadow-lg h-full"
              style={{ backgroundColor: "#E8E6F0" }}
            >
              <div className="flex justify-center mb-4">
                <Users size={40} style={{ color: "#C9A84C" }} />
              </div>
              <h3
                className="font-heading text-lg font-bold mb-2"
                style={{ color: "#0E0B1E" }}
              >
                Join a Squad
              </h3>
              <p className="font-body text-sm text-gray-text">
                Connect with a Kingdom Life Squad — a small community group for
                fellowship, accountability, and growth.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div
              className="p-8 rounded-lg text-center transition-all duration-300 hover:shadow-lg h-full"
              style={{ backgroundColor: "#E8E6F0" }}
            >
              <div className="flex justify-center mb-4">
                <MapPin size={40} style={{ color: "#C9A84C" }} />
              </div>
              <h3
                className="font-heading text-lg font-bold mb-2"
                style={{ color: "#0E0B1E" }}
              >
                CITH Hub
              </h3>
              <p className="font-body text-sm text-gray-text">
                Join a Church In The Home hub near you for midweek fellowship,
                Bible study, and community.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </SectionWrapper>

      {/* Multi-step Form */}
      <SectionWrapper variant="dark-purple">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-heading text-[28px] font-bold text-white mb-2">
            Begin Your Journey
          </h2>
          <p className="font-body text-sm text-white/70 mb-8">
            Fill out this short form so we can connect you to the right resources
            and people.
          </p>

          {isSuccess ? (
            <FadeIn>
              <div className="rounded-[8px] bg-white/10 p-10">
                <CheckCircle className="mx-auto h-14 w-14 text-green-400 mb-4" />
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  Welcome to the Family!
                </h3>
                <p className="font-body text-sm text-white/70 mb-4">
                  Your details have been received. A member of our team will
                  reach out to you soon to help you get started on your growth
                  journey.
                </p>
                <a
                  href="/grow"
                  className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-purple-light hover:underline"
                >
                  Explore Growth Pathways <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeIn>
          ) : (
            <form onSubmit={handleSubmit} className="text-left">
              {/* Step indicators */}
              <div className="flex items-center justify-center gap-3 mb-8">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-heading text-sm font-bold transition-colors ${
                        step >= s
                          ? "bg-white text-purple-dark"
                          : "bg-white/20 text-white/50"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 2 && (
                      <div
                        className={`w-12 h-0.5 ${
                          step > s ? "bg-white" : "bg-white/20"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <p className="font-heading text-sm font-semibold text-white/90 text-center mb-4">
                    Your Details
                  </p>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.name && formData.email && formData.phone) {
                        setStep(2);
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 font-heading text-[13px] font-semibold uppercase tracking-[1.5px] leading-4 bg-white text-purple-dark hover:bg-off-white rounded-[4px] px-8 py-3 transition-all duration-200 cursor-pointer"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <p className="font-heading text-sm font-semibold text-white/90 text-center mb-4">
                    Connect With a Community (Optional)
                  </p>

                  {squadList.length > 0 && (
                    <div>
                      <label className="block font-heading text-xs font-semibold text-white/70 mb-1">
                        Preferred Squad
                      </label>
                      <select
                        name="preferredSquad"
                        value={formData.preferredSquad}
                        onChange={handleInputChange}
                        className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                      >
                        <option value="">Select a squad (optional)</option>
                        {squadList.map((s: any) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {hubList.length > 0 && (
                    <div>
                      <label className="block font-heading text-xs font-semibold text-white/70 mb-1">
                        Preferred CITH Hub
                      </label>
                      <select
                        name="preferredHub"
                        value={formData.preferredHub}
                        onChange={handleInputChange}
                        className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                      >
                        <option value="">Select a CITH hub (optional)</option>
                        {hubList.map((h: any) => (
                          <option key={h.id} value={h.name}>
                            {h.name} — {h.area}, {h.city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 inline-flex items-center justify-center font-heading text-[13px] font-semibold uppercase tracking-[1.5px] leading-4 border-2 border-white text-white hover:bg-white/10 rounded-[4px] px-8 py-3 transition-all duration-200 cursor-pointer"
                    >
                      Back
                    </button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 !bg-white !text-purple-dark hover:!bg-off-white"
                    >
                      {isLoading ? "Submitting..." : "Complete"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}
