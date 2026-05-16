'use client';

import { useState, useEffect } from 'react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { media } from '@/lib/api';
import { SkeletonGroup } from '@/components/ui/Skeleton';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion';
import { Search, Play, Clock, Calendar } from 'lucide-react';

export default function AudioArchivePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [audioMessages, setAudioMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await media.getAudioSermons();
        setAudioMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch audio messages');
        setAudioMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, []);

  const sortedMessages = [...audioMessages].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date || 0).getTime();
    const dateB = new Date(b.createdAt || b.date || 0).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const filtered = sortedMessages.filter((msg) => {
    const matchesSearch =
      !searchQuery ||
      msg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.speaker?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-96 flex items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-4">
          <FadeIn>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
              Audio Archive
            </h1>
            <p className="font-body text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Listen to past messages and teachings
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Spotify Podcasts Section */}
      <SectionWrapper variant="white" className="py-12">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="font-heading text-3xl font-bold mb-2" style={{ color: '#31333B' }}>
              Podcasts
            </h2>
            <p className="font-body text-base mb-8" style={{ color: '#8A8A8E' }}>
              Listen to our podcasts on Spotify
            </p>
          </FadeIn>
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="font-heading text-lg font-semibold mb-3" style={{ color: '#31333B' }}>
                The Ecclesia Embassy Podcast
              </h3>
              <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/show/38f94eSitKoPzXLUunJRV4?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold mb-3" style={{ color: '#31333B' }}>
                The Victor Oluwadamilare Podcast
              </h3>
              <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/show/1hiBj66Ggd8GvfQVV9aQRC?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Search & Sort Section */}
      <SectionWrapper variant="off-white" className="py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search by title or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text pointer-events-none"
            />
          </div>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
            ]}
          />
        </div>
      </SectionWrapper>

      {/* Audio List Section */}
      <SectionWrapper variant="white" className="py-12">
        {loading ? (
          <SkeletonGroup count={5} variant="table-row" />
        ) : error ? (
          <div className="py-12 text-center">
            <p className="font-body text-base" style={{ color: '#8A8A90' }}>
              {error}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-body text-base" style={{ color: '#8A8A90' }}>
              No audio messages found matching your search.
            </p>
          </div>
        ) : (
          <StaggerContainer className="space-y-4">
            <p className="text-sm font-body mb-6" style={{ color: '#8A8A90' }}>
              {filtered.length} message{filtered.length !== 1 ? 's' : ''} found
            </p>
            {filtered.map((audio) => (
              <StaggerItem key={audio.id}>
                <div
                  className="p-6 rounded-lg border transition-all duration-300 hover:shadow-md"
                  style={{
                    backgroundColor: '#FAFAF8',
                    borderColor: '#E8E6F0',
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() =>
                            setActiveAudio(activeAudio === audio.id ? null : audio.id)
                          }
                          className="flex-shrink-0 p-3 rounded-full transition-colors"
                          style={{ backgroundColor: '#E8E6F0' }}
                        >
                          <Play
                            size={20}
                            style={{ color: '#C9A84C' }}
                            className="ml-0.5"
                          />
                        </button>
                        <div className="min-w-0 flex-1">
                          <h3
                            className="font-heading text-lg font-semibold mb-2 truncate"
                            style={{ color: '#0E0B1E' }}
                          >
                            {audio.title}
                          </h3>
                          <div className="flex flex-wrap gap-3 items-center text-sm">
                            <span style={{ color: '#8A8A90' }}>
                              {audio.speaker}
                            </span>
                            <div className="flex items-center gap-1" style={{ color: '#8A8A90' }}>
                              <Calendar size={14} />
                              {new Date(
                                audio.createdAt || audio.date || 0
                              ).toLocaleDateString()}
                            </div>
                            {audio.duration && (
                              <div className="flex items-center gap-1" style={{ color: '#8A8A90' }}>
                                <Clock size={14} />
                                {audio.duration}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inline Audio Player */}
                  {activeAudio === audio.id && audio.audioUrl && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E8E6F0' }}>
                      <audio
                        controls
                        src={audio.audioUrl}
                        className="w-full"
                        style={{ backgroundColor: '#FAFAF8' }}
                      />
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </SectionWrapper>
    </div>
  );
}
