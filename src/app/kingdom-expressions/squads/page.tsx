'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Shield, Music, BookOpen, Heart, ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';
import { squads as squadsAPI } from '@/lib/api';
import { FadeIn, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion';
import { SkeletonGroup } from '@/components/ui/Skeleton';

interface Squad {
  id: string;
  name: string;
  description?: string;
  leader?: {
    id: string;
    email: string;
    profile?: { firstName?: string; lastName?: string; photoUrl?: string };
  } | null;
  _count?: { members: number };
  meetingDay?: string;
  meetingTime?: string;
  activities?: string;
}

const squadIconMap: Record<string, React.ReactNode> = {
  worship: <Music className="w-5 h-5" />,
  prayer: <Heart className="w-5 h-5" />,
  teaching: <BookOpen className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
};

export default function SquadsPage() {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    const fetchSquads = async () => {
      try {
        setIsLoading(true);
        const data = await squadsAPI.getSquads();
        setSquads(data || []);
      } catch (error) {
        console.error('Failed to fetch squads:', error);
        setSquads([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSquads();
  }, []);

  const handleJoinSquad = async (squadId: string) => {
    setJoining(squadId);
    try {
      await squadsAPI.joinSquad(squadId);
    } catch (err) {
      console.error('Failed to join squad:', err);
    } finally {
      setJoining(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] sm:min-h-[70vh] lg:h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <FadeIn>
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Kingdom Life Squads
            </h1>
            <p className="font-body text-lg sm:text-xl md:text-2xl text-[#FAFAF8]">
              Find your place. Serve with purpose.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Kingdom Life Squads Write-Up */}
      <SectionWrapper variant="white">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[20px] border border-[#E8E6F0] bg-white p-8 shadow-sm mb-10">
            <h2 className="font-heading text-3xl font-bold text-[#0E0B1E] mb-4">KINGDOM LIFE SQUADS</h2>
            <p className="font-body text-base text-[#C9A84C] font-semibold mb-6">Christ on Missions…Expressing Christ, Reaching the Unreached, Meeting Needs</p>
            <div className="space-y-5 font-body text-sm text-[#4E4B6C] leading-relaxed">
              <div>
                <h3 className="font-heading text-xl font-bold text-[#0E0B1E] mb-2">INTRODUCTION</h3>
                <p>This is an arm of The Ecclesia Embassy committed to demonstrating the Scriptural lifestyle of the Kingdom of God.</p>
                <p>The Bible describes an approved religion, the type accepted as pure and undefiled before God, to be the one committed to meeting the needs of people (James 1:27). Jesus also outlined Ministry to be an avenue of meeting the needs of people with the Gospel in His Mission statement (Luke 4:18). He came to preach the Gospel to the poor, healing to the brokenhearted, deliverance to the captives, recovering of sight to the blind, and to set at liberty them that are bound.</p>
                <p>From the above, it is clear that Ministry involves meeting the needs of people, since all a captive needs is deliverance, and recovery of sight is all the blind needs, and so on.</p>
                <p>Jesus also mentioned that, meeting the needs of people is meeting His own needs, which ultimately improves our relationship with God, and also prepares a place for us in His Kingdom (Matthew 25:31-40).</p>
                <p>It is on the above premise that The Ecclesia Embassy seeks to demonstrate the love of God to the world around us. We use this platform in seizing every opportunity at our disposal, to meet the needs of individuals, communities and organizations around us.</p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#0E0B1E] mb-2">THE APPROACH</h3>
                <p>It is obvious from observations that the needs of people and organizations around us will be cumbersome to be met through one channel. This is the reason for the existence of different Squads within the Kingdom Model Life Squads Initiative.</p>
                <p className="font-semibold">Highlights of the fifteen (15) Squads are given below:</p>
                <div className="space-y-4 mt-4">
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">1. AGED KINGDOM LIFE SQUAD</p>
                    <p>This Squad is involved with taking care of individuals who are advanced in age and requires aid at different level. The support may range from provision of food items, toiletries, eye glasses, clothes, medical attention, etc.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">2. BLESSED PEOPLE KINGDOM LIFE SQUAD</p>
                    <p>This Squad is responsible for “Area boys”, prostitutes, drug addicts, repentant criminals and other categories of individuals around these set of people; turning their lives around to be Christ-like. This Squad also engage in services that give these set of people a new beginning and improve their self-worth.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">3. CHURCH AND MINISTRY KINGDOM LIFE SQUAD</p>
                    <p>This Squad is saddled with the responsibility of reaching out to Churches, Ministries, NGOs, Ministers (Pastors, Evangelists, Music Ministers, etc.) that are challenged in some areas of need. We are committed to being a channel through which God will provide needs such as chairs, furniture, musical and sound equipment, and other peculiar needs in such Churches and NGOs. The squad also attends to the needs of Ministers.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">4. COMMUNITY DEVELOPMENT KINGDOM LIFE SQUAD</p>
                    <p>This Squad is concerned with community development programs and projects in different category. We are committed to visiting remote and underdeveloped communities where social amenities such as good roads, electricity, pipe borne water, and the likes, are not available, and we will be a part of meeting those need.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">5. ENABLED KINGDOM LIFE SQUAD</p>
                    <p>This Squad has the assignment of reaching out to disabled individuals of all sorts. This includes the blind, lame, deaf, dumb, handicapped, etc. We visit them in situations where they have a location for residence, or particular spots where they can be found. Our goal is to be a blessing to them through whichever means we can.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">6. HOSPITAL KINGDOM LIFE SQUAD</p>
                    <p>This Squad is concerned with taking care of the sick in the hospital and various health centers and even outdoor patients. The focus is centered on demonstrating the love of God to them by meeting their medical needs and praying for them for healing and perfection of their health.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">7. IN-REACH KINGDOM LIFE SQUAD (MEMBERS’ WELFARE)</p>
                    <p>According to scriptures, we have the responsibility of reaching out to our immediate family before going out (Galatians 6:10). We have a high priority task of doing ‘good’ to all, especially those of our household of faith. This is why this particular squad exists to meet the needs of individuals within The Ecclesia Embassy. You know the popular phrase “Charity begins at home”.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">8. PRIVILEGED KINGDOM LIFE SQUAD</p>
                    <p>This Squad is committed to meeting the needs of the less privileged and poor individuals in our community, who may not fall into any of the other categorized Squads. They find out the peculiar needs of the individuals in this category and become a source of blessing to them through the best means at our disposal.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">9. MARKET KINGDOM LIFE SQUAD</p>
                    <p>This Squad is concerned with reaching out to the market men and women. The activities here will include having a time of fellowship with them, cleaning the market environment, providing necessities such as waste bins and drainages, and supporting ongoing projects and initiating new ones, as situation demands. Gospel tracts and hand bills will also be distributed to them to help their spiritual life.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">10. ORPHANAGE KINGDOM LIFE SQUAD</p>
                    <p>This Squad concentrates on reaching out to orphans, at every opportunity we get. This includes taking care of orphans around us and visiting those living in orphanages, with basic needs and having a time of fellowship and love with them.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">11. PRIMARY AND SECONDARY SCHOOLS KINGDOM LIFE SQUAD</p>
                    <p>This Squad is essentially committed to reaching out to children and teenagers in Primary and Secondary schools. Individuals in this Squad are people with passion for children and teenagers. They visit schools to delineate their needs and meet them. Also, they initiate and execute life transforming programs that will both educate and improve their lives.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">12. FREE AND CHANGED MEN KINGDOM LIFE SQUAD</p>
                    <p>This Squad is essentially concerned with prisoners, their welfare, spiritual life and rehabilitation. They are involved in visiting prisons at different locations, to be a blessing to them in ways that will lead to their transformation. They also offer legal aids to prisoners who needs the service.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">13. RE-MIND KINGDOM LIFE SQUAD</p>
                    <p>This Squad is committed to helping individuals with any form of mental disorder. This involves seeking out the mentally deranged, those with mood disorders, anxiety disorders, psychotic disorders, depression, and other related issues. This squad, is all out to help individuals in this category regain sanity and order.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">14. SPECIAL CHILDREN KINGDOM LIFE SQUAD</p>
                    <p>This Squad is committed to meeting an imminent and desperate need of this time. The group of children to be attended to in this Squad include children suffering from Autism, Down Syndrome, Cerebral Palsy, Difficulty in Learning, ADHD (Attention Deficit Hyperactivity Disorder), Attention Deficit Disorder (ADD), and the likes. The squad locates the aforementioned children in order to meet their needs. The foremost need for these children is love and that’s what we give them unreservedly and also meet other needs.</p>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#0E0B1E]">15. JESUS’ BRIDE KINGDOM LIFE SQUAD</p>
                    <p>This Squad is concerned with reaching out to widows (women that have lost their husbands), and single mothers of children that have been abandoned by their husbands. They locate individuals in this category that genuinely need help and reach out to them with the means we have.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#0E0B1E] mb-2">OUR TARGET AREA</h3>
                <p>In reaching out to people, Jesus gave His disciples a pattern in Acts 1:8, saying they should begin from their immediate environment Jerusalem, to Judea, to Samaria, and then to the uttermost part of the earth.</p>
                <p>In that same light, we would begin again, by reaching out to the great people in our immediate community of Asokoro, spread all over Abuja then spread all over Nigeria, and ultimately to the whole world. In all, no one around us that requires genuine aid must be left unattended to.</p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#0E0B1E] mb-2">OUR ULTIMATE AIM</h3>
                <p>Our one and only purpose of Kingdom Life Squads is to demonstrate the love of God to humanity. Our drive is to live the true life that Jesus expects from us, according to Matthew 25:31-46, and James 1:27.</p>
                <p>For us, these are our Kingdom Ministries where we communicate Christ, His love and life to humanity and our society.</p>
                <p>We are committed to putting smiles on the faces of millions of individuals all over the world. Just like Job, in chapter 29:11-17 of his book, we will be eyes to the blind, foot to the lame, and fathers to the poor.</p>
                <p className="font-semibold">We are going all out for Jesus. The Ecclesia Embassy… It’s time to recommit to the works of Christ! Hallelujah!</p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Squads List Section */}
      <SectionWrapper variant="white">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <SkeletonGroup count={4} variant="card" />
          ) : squads.length > 0 ? (
            <StaggerContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {squads.map(squad => (
                  <StaggerItem key={squad.id}>
                    <HoverLift>
                      <div className="bg-white rounded-xl border border-[#E8E6F0] shadow-sm p-6 h-full flex flex-col hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-heading text-lg font-bold text-[#0E0B1E] flex-1">
                            {squad.name}
                          </h3>
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-[#E8E6F0] text-[#C9A84C]">
                            {squadIconMap[squad.name?.toLowerCase()] || <Users className="w-5 h-5" />}
                          </div>
                        </div>

                        <p className="font-body text-sm text-[#8A8A90] mb-4 flex-grow">
                          {squad.description || 'Join this squad to serve and grow with your team.'}
                        </p>

                        <div className="space-y-2 mb-6 border-t border-[#E8E6F0] pt-4">
                          <div className="flex items-center gap-2 text-[#0E0B1E] text-sm">
                            <Users className="w-4 h-4 text-[#C9A84C]" />
                            <span>Led by {squad.leader?.profile ? `${squad.leader.profile.firstName || ''} ${squad.leader.profile.lastName || ''}`.trim() : 'TBA'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#0E0B1E] text-sm">
                            <Users className="w-4 h-4 text-[#C9A84C]" />
                            <span>{squad._count?.members || 0} members</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/kingdom-expressions/squads/${squad.id}`} className="flex-1">
                            <Button
                              variant="primary"
                              className="w-full bg-[#C9A84C] hover:bg-[#0E0B1E] flex items-center justify-center gap-2"
                            >
                              View Details
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </HoverLift>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-[#E8E6F0] mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-[#0E0B1E] mb-2">
                No squads available
              </h3>
              <p className="text-[#8A8A90]">
                Check back soon for new Kingdom Life squads.
              </p>
            </div>
          )}
        </div>
      </SectionWrapper>
    </main>
  );
}
