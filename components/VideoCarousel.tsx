'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoCard } from './VideoCard';
import type { ContentItem } from '@/lib/types';

interface VideoCarouselProps {
  videos: ContentItem[];
  title: string;
}

export function VideoCarousel({ videos, title }: VideoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (videos.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="גלול ימינה"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="גלול שמאלה"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 space-x-reverse pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {videos.map((video) => (
            <div key={video.id} className="flex-none w-80 snap-start">
              <VideoCard item={video} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
