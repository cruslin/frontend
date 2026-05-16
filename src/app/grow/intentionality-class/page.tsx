'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';
import ProgramHero from '@/components/training/ProgramHero';
import { intentionalityClass } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/Toast';
import { FadeIn } from '@/components/ui/Motion';
import {
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Sparkles,
  Users,
} from 'lucide-react';
import EditableContent from '@/components/ui/EditableContent';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Array<{ id: string; title: string; order: number }>;
  _count?: { enrollments: number };
}

const journeyCards = [
  {
    icon: Clock,
    title: 'Paced formation',
    desc: 'A guided journey that helps learners move with intention instead of drifting through growth.',
  },
  {
    icon: BookOpen,
    title: 'Doctrinal grounding',
    desc: 'Foundational teaching clarifies faith, culture, and what it means to live kingdom values daily.',
  },
  {
    icon: Users,
    title: 'Community practice',
    desc: 'Growth is reinforced through accountability, interaction, and real ministry participation.',
  },
];

const outcomeCards = [
  {
    title: 'Foundation',
    desc: 'Strong roots in the Christian faith and a clear understanding of the Ecclesia Embassy system.',
  },
  {
    title: 'Transformation',
    desc: 'Character formation, discipline, and a healthy work culture for kingdom service and stewardship.',
  },
  {
    title: 'Responsibility',
    desc: 'Preparedness to serve, lead, and help others grow with maturity and clarity.',
  },
];

const phaseCards = [
  {
    title: 'Phase One - Move-In',
    desc: 'The entry level introduces the basics of the Christian faith and the Ecclesia Embassy. It includes six teachings and can be completed over three weeks or through a one-day crash course.',
  },
  {
    title: 'Phase Two - Maturity and Ministry',
    desc: 'This phase develops culture, consistency, honor, and stewardship through teachings, assignments, evaluations, and hands-on service experiences.',
  },
  {
    title: 'Phase Three - Missions and Mandate',
    desc: 'The advanced phase shifts the focus from personal growth to kingdom impact, preparing committed members for evangelism, leadership, and wider responsibility.',
  },
];

export default function IntentionalityClassPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [preferredFormat, setPreferredFormat] = useState('hybrid');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    intentionalityClass.getAvailableCourses()
      .then((data) => setCourses(data || []))
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, []);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const userName = user?.profile
    ? [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' ')
    : '';

  const selectedCourse = courses.find((course) => course.id === selectedCourseId);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isAuthenticated) {
      error('Please sign in to enroll in the Intentionality Class.');
      setIsLoading(false);
      return;
    }

    if (!selectedCourseId) {
      error('Please select a course to enroll in.');
      setIsLoading(false);
      return;
    }

    try {
      await intentionalityClass.enroll(selectedCourseId);
      setIsSuccess(true);
      success('Thank you for enrolling in the Intentionality Class.');
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to enroll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <ProgramHero
        eyebrow="Growth Pathway"
        title="The Intentionality Class"
        subtitle="Level 1-3: Move-In | Maturity | Ministry"
        description="A step-by-step formation journey that helps believers grow in faith, align with culture, and mature into service, stewardship, and leadership."
        logoSrc="/intentionality-class-logo.png"
        logoAlt="The Intentionality Class"
        logoWidth={1200}
        logoHeight={480}
        chips={[
          'Foundational faith',
          'Culture and stewardship',
          'Leadership formation',
        ]}
        stats={[
          { value: '3', label: 'formation levels' },
          { value: 'Hybrid', label: 'delivery options' },
          { value: 'Step-by-step', label: 'growth model' },
        ]}
        backgroundClassName="bg-[radial-gradient(circle_at_top_left,rgba(52,152,219,0.2),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(201,168,76,0.2),transparent_30%),linear-gradient(135deg,#0E0B1E_0%,#351E63_48%,#1D6CB0_100%)]"
        overlayClassName="bg-[linear-gradient(180deg,rgba(14,11,30,0.12),rgba(14,11,30,0.45))]"
        logoCardClassName="bg-white/8"
        logoWrapClassName="bg-[linear-gradient(180deg,#ffffff_0%,#faf9ff_100%)]"
        logoClassName="max-w-[560px]"
        aside={
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[1.8px] text-white/60">
              Pathway at a glance
            </p>
            <div className="mt-4 space-y-3">
              {[
                'Move-In introduces the foundations of faith and ministry culture.',
                'Maturity and Ministry develops stewardship, consistency, and service habits.',
                'Missions and Mandate prepares committed members for wider kingdom responsibility.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-gold" />
                  <p className="font-body text-sm leading-6 text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        }
        actions={
          <>
            <Button variant="primary" onClick={() => scrollToSection('enroll')}>
              Enroll Now
            </Button>
            <Button variant="secondary" onDark onClick={() => scrollToSection('pathway')}>
              Explore the Pathway
            </Button>
          </>
        }
      />

      <EditableContent pagePath="/grow/intentionality-class" />

      <SectionWrapper variant="white">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-[30px] font-bold text-slate md:text-[34px]">
              Built for purposeful growth
            </h2>
            <p className="mt-3 font-body text-sm leading-7 text-gray-text md:text-base">
              The Intentionality Class is a foundational journey designed to help believers live with
              purpose and clarity. It strengthens spiritual foundation, shapes daily decisions, and
              forms a healthy rhythm of service and community.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {journeyCards.map((card) => {
            const Icon = card.icon;

            return (
              <FadeIn key={card.title} delay={0.08}>
                <div className="rounded-[24px] border border-gray-border bg-off-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple text-white shadow-purple">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-slate">{card.title}</h3>
                  <p className="mt-3 font-body text-sm leading-7 text-gray-text">{card.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="off-white" id="pathway">
        <FadeIn>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-[30px] font-bold text-slate md:text-[34px]">
              What the class is building in people
            </h2>
            <p className="mt-3 font-body text-sm leading-7 text-gray-text md:text-base">
              At its core, the Intentionality Class is about intentional growth: raising individuals
              who understand their faith and live it out through service, stewardship, and leadership.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {outcomeCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[24px] border border-gray-border bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15">
                <Sparkles className="h-5 w-5 text-gold-dark" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold text-slate">{card.title}</h3>
              <p className="mt-3 font-body text-sm leading-7 text-gray-text">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {phaseCards.map((phase, index) => (
            <div
              key={phase.title}
              className="rounded-[28px] bg-[linear-gradient(180deg,#0E0B1E_0%,#24183D_100%)] p-6 text-white shadow-xl"
            >
              <p className="font-heading text-xs font-semibold uppercase tracking-[1.8px] text-gold">
                Stage {index + 1}
              </p>
              <h3 className="mt-3 font-heading text-2xl font-bold text-white">{phase.title}</h3>
              <p className="mt-4 font-body text-sm leading-7 text-white/72">{phase.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] border border-gray-border bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-heading text-[24px] font-bold text-slate md:text-[28px]">
            The process in one sentence
          </h3>
          <p className="mt-4 font-body text-sm leading-8 text-gray-text md:text-base">
            The Intentionality Class moves partakers from being grounded in faith, to living a
            disciplined and service-driven life, and ultimately to embracing leadership and kingdom
            responsibility within the Ecclesia mandate.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="white" id="enroll">
        <FadeIn>
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[28px] bg-[linear-gradient(135deg,#0E0B1E_0%,#2C1D52_100%)] p-6 text-white shadow-xl md:p-8">
              <p className="font-heading text-xs font-semibold uppercase tracking-[1.8px] text-white/60">
                Enrollment journey
              </p>
              <h2 className="mt-3 font-heading text-[30px] font-bold text-white md:text-[34px]">
                Join the class with clarity
              </h2>
              <p className="mt-3 font-body text-sm leading-7 text-white/72 md:text-base">
                Choose a course, select your preferred format, and continue your growth journey from
                the dashboard once your enrollment is complete.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Select the available course that fits your current cohort.',
                  'Choose whether you prefer in-person, online, or hybrid learning.',
                  'Access your course materials from the dashboard after enrollment.',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-slate">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <p className="font-body text-sm leading-7 text-white/78">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-gray-border bg-off-white p-6 shadow-sm md:p-8">
              <h2 className="font-heading text-[30px] font-bold text-slate md:text-[34px]">
                Enroll Now
              </h2>
              <p className="mt-3 font-body text-sm leading-7 text-gray-text md:text-base">
                Join us on this transformative journey.
              </p>

              {isSuccess ? (
                <div className="mt-8 rounded-[24px] border border-success/30 bg-success/10 p-8 text-center">
                  <CheckCircle className="mx-auto h-16 w-16 text-success" />
                  <h3 className="mt-4 font-heading text-2xl font-bold text-slate">
                    Thank you for enrolling
                  </h3>
                  <p className="mt-3 font-body text-sm leading-7 text-gray-text">
                    You can now access your course materials from your dashboard.
                  </p>
                  <Link
                    href="/dashboard/class"
                    className="mt-6 inline-flex min-w-[180px] items-center justify-center rounded-[4px] bg-gold px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[1.5px] text-slate transition-colors hover:bg-gold-dark"
                  >
                    Go to My Courses
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {isAuthenticated && user ? (
                    <div className="rounded-[16px] border border-gray-border bg-white px-4 py-4">
                      <p className="font-heading text-xs font-semibold uppercase tracking-[1.5px] text-gray-text">
                        Enrolling as
                      </p>
                      <p className="mt-2 font-heading text-sm font-bold text-slate">
                        {userName || user.email}
                      </p>
                      {userName ? (
                        <p className="mt-1 font-body text-xs text-gray-text">{user.email}</p>
                      ) : null}
                    </div>
                  ) : null}

                  <div>
                    <label className="mb-2 block font-heading text-sm font-semibold text-slate">
                      Preferred Course
                    </label>
                    {coursesLoading ? (
                      <div className="h-[44px] w-full animate-pulse rounded-lg bg-white" />
                    ) : courses.length === 0 ? (
                      <p className="font-body text-sm italic text-gray-text">
                        No courses are available right now. Please check back later.
                      </p>
                    ) : (
                      <>
                        <select
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          className="w-full rounded-lg border-2 border-gray-border bg-white px-4 py-2 font-body text-slate transition-colors focus:border-gold focus:outline-none"
                          required
                        >
                          <option value="" disabled>
                            Select a course...
                          </option>
                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.title} ({course.modules.length} modules)
                            </option>
                          ))}
                        </select>
                        {selectedCourse ? (
                          <p className="mt-3 font-body text-xs leading-6 text-gray-text">
                            {selectedCourse.description}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block font-heading text-sm font-semibold text-slate">
                      Preferred Format
                    </label>
                    <select
                      value={preferredFormat}
                      onChange={(e) => setPreferredFormat(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-border bg-white px-4 py-2 font-body text-slate transition-colors focus:border-gold focus:outline-none"
                    >
                      <option value="in-person">In-Person</option>
                      <option value="online">Online</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || courses.length === 0}
                    className="w-full"
                  >
                    {isLoading ? 'Enrolling...' : 'Enroll Now'}
                  </Button>

                  {!isAuthenticated ? (
                    <p className="text-center font-body text-sm text-gray-text">
                      You need to{' '}
                      <Link href="/auth/login" className="font-semibold text-gold-dark hover:underline">
                        sign in
                      </Link>{' '}
                      to enroll in this class.
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </FadeIn>
      </SectionWrapper>
    </main>
  );
}
