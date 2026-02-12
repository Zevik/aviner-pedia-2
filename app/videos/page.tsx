import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import { FilterSidebar } from '@/components/FilterSidebar';
import { VideoCard } from '@/components/VideoCard';
import { getContentItems, getSubCategories } from '@/lib/db';

interface VideosPageProps {
  searchParams: Promise<{ topic?: string }>;
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = await searchParams;
  const selectedTopic = params.topic;

  // Fetch videos and categories
  const [videos, categories] = await Promise.all([
    getContentItems({
      main_category: 'סרטונים',
      sub_category: selectedTopic,
      limit: 50,
    }),
    getSubCategories('סרטונים'),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">סרטונים</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div>טוען...</div>}>
              <FilterSidebar
                categories={categories}
                currentCategory={selectedTopic}
                basePath="/videos"
              />
            </Suspense>
          </div>

          {/* Content Grid */}
          <div className="flex-1">
            {selectedTopic && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-muted-foreground">
                  {selectedTopic}
                </h2>
              </div>
            )}

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video.id} item={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  לא נמצאו סרטונים
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
