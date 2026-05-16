'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Search, Users, Globe } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cith } from '@/lib/api';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion';
import { Skeleton, SkeletonGroup } from '@/components/ui/Skeleton';

interface Hub {
  id: string;
  name: string;
  leader?: { profile?: { firstName?: string; lastName?: string } } | string;
  location?: string;
  area?: string;
  city?: string;
  meetingDay?: string;
  meetingTime?: string;
  _count?: { members: number };
}

function getLeaderName(hub: Hub): string {
  if (!hub.leader) return 'Unassigned';
  if (typeof hub.leader === 'string') return hub.leader;
  const profile = hub.leader.profile;
  return [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || 'Unassigned';
}

function getHubLocation(hub: Hub): string {
  if (hub.location) return hub.location;
  return [hub.area, hub.city].filter(Boolean).join(', ') || 'Location TBD';
}

function getMemberCount(hub: Hub): number {
  if (hub._count?.members !== undefined) return hub._count.members;
  return 0;
}

export default function CITHPage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [filteredHubs, setFilteredHubs] = useState<Hub[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        setIsLoading(true);
        const data = await cith.getHubs();
        setHubs(data || []);
        setFilteredHubs(data || []);
      } catch (error) {
        console.error('Failed to fetch hubs:', error);
        setHubs([]);
        setFilteredHubs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHubs();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredHubs(hubs);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = hubs.filter(
        hub =>
          hub.name.toLowerCase().includes(lowerQuery) ||
          getHubLocation(hub).toLowerCase().includes(lowerQuery) ||
          hub.area?.toLowerCase().includes(lowerQuery) ||
          hub.city?.toLowerCase().includes(lowerQuery) ||
          getLeaderName(hub).toLowerCase().includes(lowerQuery)
      );
      setFilteredHubs(filtered);
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
              Church in the House
            </h1>
            <p className="font-body text-lg sm:text-xl md:text-2xl text-[#FAFAF8]">
              Find fellowship near you
            </p>
          </div>
        </FadeIn>
      </section>

      {/* About CITH */}
      <SectionWrapper variant="white">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center mb-0">
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-[#C9A84C] mb-4">
              About CITH
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#0E0B1E] mb-8">
              The Church in The House
            </h2>
            <div className="space-y-6 text-left text-[#0E0B1E] font-body text-base md:text-lg leading-relaxed">
              <p>
                The Church in The House (CITH) is the Arm of The Ecclesia Embassy commissioned
                for the gathering together of God&apos;s people (believers) to serve Christ in the
                Home. Jesus said in Matthew 16:18 that &ldquo;I will build My Church&rdquo;. He was
                aware of other Churches operating in the Roman Empire at that time, but He had a
                desire to build a model Church that would replicate heaven on earth. Hence, He
                proposed a kind of Church that will not be limited by location, distance, or
                language barrier. Unlike the other churches, He wanted to take His Church beyond
                the shores of a Temple building.
              </p>
              <p>
                The CITH is mandated to operate with the template of the revelation we have here
                in The Ecclesia Embassy concerning the Church. As seen from scriptures, the
                purposes of the CITH are for{' '}
                <span className="font-semibold text-[#0E0B1E]">
                  Knowledge, Transformation, Government, Authority and Discipleship
                </span>{' '}
                while its operations are{' '}
                <span className="font-semibold text-[#0E0B1E]">
                  Evangelism, Training, Fellowship, Worship and Works
                </span>
                .
              </p>
            </div>
          </div>
        </FadeIn>
      </SectionWrapper>

      {/* Search & Hubs List Section */}
      <SectionWrapper variant="white">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <FadeIn>
            <div className="mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A90] w-5 h-5" />
                <Input
                  placeholder="Search by location, hub name, or leader..."
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className="pl-12 w-full"
                />
              </div>
            </div>
          </FadeIn>

          {/* Hubs Grid */}
          {isLoading ? (
            <SkeletonGroup count={6} variant="card" />
          ) : filteredHubs.length > 0 ? (
            <StaggerContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHubs.map(hub => (
                  <StaggerItem key={hub.id}>
                    <div className="bg-white rounded-lg border border-[#E8E6F0] shadow-sm p-6 hover:shadow-md transition-shadow h-full">
                      <h3 className="font-heading text-lg font-bold text-[#0E0B1E] mb-1">
                        {hub.name}
                      </h3>
                      <p className="text-[#8A8A90] text-sm mb-4">
                        Led by {getLeaderName(hub)}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-[#0E0B1E]">
                          <MapPin className="w-4 h-4 text-[#C9A84C]" />
                          <span className="text-sm">{getHubLocation(hub)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#0E0B1E]">
                          <Users className="w-4 h-4 text-[#C9A84C]" />
                          <span className="text-sm">{getMemberCount(hub)} members</span>
                        </div>
                      </div>

                      <Link href={`/cith/${hub.id}`}>
                        <Button variant="primary" className="w-full">
                          View Hub
                        </Button>
                      </Link>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-[#E8E6F0] mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-[#0E0B1E] mb-2">
                No hubs found
              </h3>
              <p className="text-[#8A8A90]">
                Try adjusting your search or register your own hub.
              </p>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper variant="dark-purple">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Can't Find a Hub Near You?
            </h2>
            <p className="font-body text-lg text-[#E8E6F0] mb-8 max-w-2xl mx-auto">
              Join our e-Hub to connect with believers worldwide, or register your home as a hub
              to lead a fellowship group in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cith/ehub">
                <Button variant="secondary" onDark className="w-full sm:w-auto">
                  Join e-Hub
                </Button>
              </Link>
              <Link href="/cith/register">
                <Button variant="primary" className="w-full sm:w-auto">
                  Register a Hub
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </SectionWrapper>
    </main>
  );
}
