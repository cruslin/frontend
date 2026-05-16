"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { contact } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { FadeIn } from "@/components/ui/Motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const contactDetails = [
  {
    icon: MapPin,
    label: "Location",
    value: "Sarki Tafida Street, Guzape Hills, Asokoro, Abuja",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 803 400 7867",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@theecclesia.org",
  },
  {
    icon: Clock,
    label: "Service Times",
    value: "Sundays 8:00 AM · Tuesdays & Fridays 5:30 PM",
  },
];

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      await contact.submitContact(data);
      success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (err) {
      error(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-bands">
      <PageHero
        eyebrow="Contact Us"
        title="We'd love to hear from you."
        subtitle="Reach out and let us know how we can serve you."
        description="Whether you have a question, need prayer, or simply want to connect — our team is here. Send us a message and we will get back to you shortly."
        backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
        actions={[
          { href: "/new-here", label: "Plan Your Visit", variant: "primary" },
          { href: "/prayer", label: "Submit Prayer Request", variant: "secondary", onDark: true },
        ]}
        compact
      />

      {/* Form + Info */}
      <SectionWrapper variant="white">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Form column */}
          <FadeIn>
            <SectionHeading
              eyebrow="Send a Message"
              title="Write to us directly."
              description="Fill out the form below and we'll get back to you as soon as possible."
              className="mb-10"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Your Name
                </label>
                <Input
                  {...register("name")}
                  placeholder="Full name"
                  className={errors.name ? "border-error" : ""}
                />
                {errors.name && (
                  <p className="mt-1.5 font-body text-sm text-error">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Email Address
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                  className={errors.email ? "border-error" : ""}
                />
                {errors.email && (
                  <p className="mt-1.5 font-body text-sm text-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Subject
                </label>
                <Input
                  {...register("subject")}
                  placeholder="What is this about?"
                  className={errors.subject ? "border-error" : ""}
                />
                {errors.subject && (
                  <p className="mt-1.5 font-body text-sm text-error">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Message
                </label>
                <textarea
                  {...register("message")}
                  placeholder="Tell us more..."
                  rows={7}
                  className="w-full rounded-[14px] border border-[rgba(14,11,30,0.12)] bg-white px-4 py-3 font-body text-sm text-slate placeholder-gray-text transition-colors focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/15 resize-none"
                />
                {errors.message && (
                  <p className="mt-1.5 font-body text-sm text-error">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </FadeIn>

          {/* Info column */}
          <FadeIn direction="left" delay={0.1}>
            <div className="mesh-panel rounded-[32px] p-8 shadow-[0_30px_60px_rgba(14,11,30,0.08)]">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.28em] text-purple-vivid">
                Get in Touch
              </p>
              <h3 className="mt-4 font-heading text-2xl font-bold text-slate">
                We are here for you.
              </h3>
              <p className="mt-3 font-body text-sm leading-7 text-gray-text">
                Our team is available to answer your questions, receive prayer requests, or help you find your next step at the Embassy.
              </p>

              <div className="mt-8 space-y-5">
                {contactDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-light text-purple-vivid">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-text">
                          {item.label}
                        </p>
                        <p className="mt-1 font-body text-sm text-slate">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </SectionWrapper>

      {/* Map */}
      <SectionWrapper variant="lavender">
        <SectionHeading
          eyebrow="Find Us"
          title="Come worship with us."
          description="Sarki Tafida Street, Guzape Hills, Asokoro, Abuja, Nigeria"
          className="mb-10"
        />
        <FadeIn>
          <div className="overflow-hidden rounded-[28px] shadow-[0_20px_48px_rgba(14,11,30,0.10)] h-[220px] sm:h-[300px] md:h-[400px]">
            <iframe
              src="https://maps.google.com/maps?q=Sarki+Tafida+Street+Guzape+Hills+Asokoro+Abuja+Nigeria&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Ecclesia Embassy location"
            />
          </div>
        </FadeIn>
      </SectionWrapper>
    </main>
  );
};

export default ContactPage;
