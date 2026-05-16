'use client';

import { useState, useEffect } from 'react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { media } from '@/lib/api';
import { SkeletonGroup } from '@/components/ui/Skeleton';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

function extractYoutubeId(url?: string): string {
  if (!url) return 'dQw4w9WgXcQ';
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([^&\n?#]+)/
  );
  return match?.[1] || 'dQw4w9WgXcQ';
}

export default function VideoMessagesPage() {
  const [videoMessages, setVideoMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await media.getVideoMessages();
        setVideoMessages(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch video messages'
        );
        setVideoMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-96 flex items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-4">
          <FadeIn>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
              Video Messages
            </h1>
            <p className="font-body text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Watch and be transformed
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Video Grid Section */}
      <SectionWrapper variant="white" className="py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonGroup count={6} variant="card" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="font-body text-base" style={{ color: '#8A8A90' }}>
              {error}
            </p>
          </div>
        ) : videoMessages.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-body text-base" style={{ color: '#8A8A90' }}>
              No video messages available yet.
            </p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoMessages.map((video) => (
              <StaggerItem key={video.id}>
                <div
                  className="rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: '#FAFAF8',
                    borderColor: '#E8E6F0',
                  }}
                >
                  {/* Video Thumbnail */}
                  <div className="relative w-full aspect-video bg-black overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(video.youtubeUrl)}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3
                      className="font-heading text-lg font-semibold mb-3 line-clamp-2"
                      style={{ color: '#0E0B1E' }}
                    >
                      {video.title}
                    </h3>

                    <div className="flex flex-col gap-2">
                      {video.speaker && (
                        <p
                          className="font-body text-sm"
                          style={{ color: '#8A8A90' }}
                        >
                          {video.speaker}
                        </p>
                      )}

                      <p
                        className="font-body text-sm"
                        style={{ color: '#8A8A90' }}
                      >
                        {new Date(
                          video.createdAt || video.date || 0
                        ).toLocaleDateString()}
                      </p>

                      {video.series && (
                        <div className="mt-3">
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold"
                            style={{
                              backgroundColor: '#E8E6F0',
                              color: '#0E0B1E',
                            }}
                          >
                            {video.series}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </SectionWrapper>
    </div>
  );
}
