'use client';

import { useEffect, useState } from 'react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { media } from '@/lib/api';
import { SkeletonGroup } from '@/components/ui/Skeleton';
import { FadeIn } from '@/components/ui/Motion';
import { StaggerContainer, StaggerItem } from '@/components/ui/Motion';
import { Music, Play, Clock } from 'lucide-react';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  albumArt?: string;
  url: string;
}

export default function EcclesiaMusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const data = await media.getMusic();
        setTracks(data);
      } catch (error) {
        console.error('Failed to fetch music tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section with Unsplash Background */}
      <section
        className="relative h-96 flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        <div className="relative z-10 text-center px-4">
          <div className="flex justify-center mb-4">
            <Music className="w-16 h-16 text-[#E8E6F0]" />
          </div>
          <h1 className="text-5xl font-bold font-heading text-white mb-4">Ecclesia Music</h1>
          <p className="text-xl text-[#E8E6F0]">Worship in spirit and truth</p>
        </div>
      </section>

      {/* Music Content */}
      <SectionWrapper variant="white">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <SkeletonGroup
                count={6}
                className="space-y-4"
              />
            ) : tracks.length === 0 ? (
              <div className="text-center py-16">
                <Music className="w-12 h-12 text-[#E8E6F0] mx-auto mb-4" />
                <p className="text-lg text-[#8A8A90] font-body">No music tracks available yet.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold font-heading text-[#0E0B1E] mb-8 text-center">
                  Worship Tracks
                </h2>
                <StaggerContainer>
                  <div className="space-y-4">
                    {tracks.map((track) => (
                      <StaggerItem key={track.id}>
                        <div className="bg-[#FAFAF8] rounded-lg p-6 hover:shadow-lg transition-shadow group flex items-center gap-6">
                          {/* Album Art */}
                          <div className="flex-shrink-0">
                            {track.albumArt ? (
                              <img
                                src={track.albumArt}
                                alt={track.title}
                                className="w-24 h-24 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gradient-to-br from-[#E8E6F0] to-[#lavender] rounded-lg flex items-center justify-center">
                                <Music className="w-10 h-10 text-[#C9A84C]" />
                              </div>
                            )}
                          </div>

                          {/* Track Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-heading font-bold text-[#0E0B1E] truncate">
                              {track.title}
                            </h3>
                            <p className="text-[#8A8A90] font-body text-sm mb-2">
                              {track.artist}
                            </p>
                            <div className="flex items-center gap-1 text-[#8A8A90] font-body text-sm">
                              <Clock className="w-4 h-4" />
                              {track.duration}
                            </div>
                          </div>

                          {/* Play Button */}
                          <a
                            href={track.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-[#C9A84C] hover:bg-[#0E0B1E] text-white rounded-full transition-colors group-hover:scale-110 transform"
                          >
                            <Play className="w-5 h-5 ml-0.5" />
                          </a>
                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
              </div>
            )}
          </div>
        </FadeIn>
      </SectionWrapper>
    </main>
  );
}
