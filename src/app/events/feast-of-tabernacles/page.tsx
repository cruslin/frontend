import SectionWrapper from "@/components/ui/SectionWrapper";
import { Calendar, MapPin } from "lucide-react";

// ── Update these each year ──────────────────────────────────────────────────
const YEAR = "2026";
const DATE_RANGE = "September 27 — October 3, 2026";
const SCHEDULE: { day: string; sessions: string }[] = [
  { day: "Day 1 — Sep 27", sessions: "Opening Session & Worship Night" },
  { day: "Day 2 — Sep 28", sessions: "Morning Word Session & Afternoon Workshop" },
  { day: "Day 3 — Sep 29", sessions: "Kingdom Advancement Session & Evening Encounter" },
  { day: "Day 4 — Sep 30", sessions: "Worship & Prayer Night" },
  { day: "Day 5 — Oct 1",  sessions: "Morning Word Session & Afternoon Workshop" },
  { day: "Day 6 — Oct 2",  sessions: "Kingdom Advancement Session & Evening Encounter" },
  { day: "Day 7 — Oct 3",  sessions: "Grand Finale & Commissioning Service" },
];
// ────────────────────────────────────────────────────────────────────────────

export default function FeastOfTabernaclesPage() {
  return (
    <>
      <section className="relative flex items-center justify-center py-28 md:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-dark via-purple to-purple-vivid" />
        <div className="absolute inset-0 bg-[rgba(14,0,22,0.84)]" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 text-center sm:px-6 md:px-8">
          <p className="font-heading text-xs font-bold uppercase tracking-widest text-purple-light mb-3">Annual Anniversary</p>
          <h1 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Feast of Tabernacles {YEAR}
          </h1>
          <h6 className="mt-3 font-serif text-lg font-light text-off-white">
            {DATE_RANGE}
          </h6>
        </div>
      </section>

      <SectionWrapper variant="white">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-lg mx-auto mb-10">
          {[
            { icon: Calendar, title: "7 Days", desc: "Sep 27 – Oct 3" },
            { icon: MapPin, title: "Abuja, Nigeria", desc: "The Ecclesia Embassy" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center">
                <Icon className="mx-auto h-8 w-8 text-purple mb-2" />
                <h3 className="font-heading text-lg font-bold text-slate">{item.title}</h3>
                <p className="text-body-small">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto max-w-3xl mb-12">
          <h2 className="font-heading text-[28px] font-bold text-slate text-center mb-8">About the Feast of Tabernacles</h2>
          <div className="space-y-5 font-body text-base text-gray-text leading-relaxed">
            <p>
              The Lord began talking to me, saying, <span className="font-semibold text-slate">THE ECCLESIA EMBASSY IS A STRANGE MOVEMENT!</span>
            </p>
            <p>
              And He said, &ldquo;The Feast of Tabernacles was to be celebrated in the seventh month of the year,
              which is between September and October because the Hebrews lived in tents on their journey from
              Egypt to Canaan and also celebrated God&rsquo;s goodness in bringing them into the promised land!&rdquo;
            </p>
            <p>
              He went ahead and said to me, &ldquo;Be committed to obeying My Word! Desire to please Me and live
              with My blessing instead of My judgement.&rdquo;
            </p>
            <blockquote className="border-l-4 border-gold pl-4 italic text-gray-text">
              &ldquo;So why do you call me &lsquo;Lord&rsquo; when you won&rsquo;t obey me?&rdquo; — Luke 6:46 TLB
            </blockquote>
            <p>
              Then He brought me to the Book of Nehemiah and began to teach me deep things about the Feast of
              Tabernacles from Chapter 8:13–18 TLB. He brought me into the reality of His command to His people
              about this special time of celebration. Moses was commanded to announce it far and wide among the
              population that no one is exempt from this crucial moment. Even Christ, in the New Testament,
              identified with and celebrated the Feast of Tabernacles.
            </p>
            <p>
              As a people dedicated to obedience, it is a time of joy, community, and reflection, emphasizing
              gratitude for the harvest, His guidance, and the importance of faith and reliance on God — and most
              importantly, the place of Christ in our overall experience.
            </p>
            <p>
              Celebrating Jesus Christ is significant for us because of the profound impact He has had on our
              history, our culture as a Church, and our personal faith. Spiritually, Christ is the central figure
              of our faith. His teachings of love, forgiveness, compassion, and humility have imparted impeccable
              values into the various expressions of our lives. We have been profoundly influenced as individuals
              and as a nation that He is building for Himself.
            </p>
            <p>
              This celebration brings us into a time of hope and renewal for many years and seasons to come. We
              enter into the possibility of new beginnings and the promise of His numerous blessings that lie ahead.
              We rejoice in the love of Christ that gave us a community, a communality and a common unity. Through
              Him, we have a sense of belonging.
            </p>
            <p>
              Everyone is specially invited to join in this celebration of the One who gives grace, beauty, peace,
              safety, joy, love and life. Let us celebrate Christ together at the Feast of Tabernacles!
            </p>
            <p className="font-heading text-sm font-semibold text-slate text-right">— Victor Oluwadamilare</p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <h2 className="font-heading text-[28px] font-bold text-slate text-center mb-4">Event Schedule</h2>
          <div className="space-y-3">
            {SCHEDULE.map((d) => (
              <div key={d.day} className="flex gap-4 rounded-[8px] bg-off-white p-4">
                <p className="font-heading text-sm font-bold text-purple shrink-0 w-28">{d.day}</p>
                <p className="font-body text-sm text-gray-text">{d.sessions}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="dark-purple">
        <div className="mx-auto max-w-md text-center">
          <h2 className="font-heading text-[28px] font-bold text-white mb-4">Join Us</h2>
          <p className="font-body text-sm text-white/70 mb-4">
            The Feast of Tabernacles is open to all. No registration required — simply come and be part of this glorious celebration.
          </p>
          <p className="font-body text-sm text-white/70">
            For more information, contact us at <a href="/contact" className="text-purple-light hover:underline">our contact page</a>.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
