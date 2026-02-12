import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { FilterSidebar } from '@/components/FilterSidebar';
import { getContentItems, getSubCategories } from '@/lib/db';

interface SeriesPageProps {
  searchParams: Promise<{ topic?: string }>;
}

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const params = await searchParams;
  const selectedTopic = params.topic;

  // Fetch series items and categories
  const [seriesItems, categories] = await Promise.all([
    getContentItems({
      main_category: 'סדרות',
      sub_category: selectedTopic,
      limit: 50,
    }),
    getSubCategories('סדרות'),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">סדרות לימוד</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div>טוען...</div>}>
              <FilterSidebar
                categories={categories}
                currentCategory={selectedTopic}
                basePath="/series"
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

            {seriesItems.length > 0 ? (
              <div className="space-y-4 max-w-4xl">
                {seriesItems.map((item) => (
                  <SeriesItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  לא נמצאו סדרות לימוד
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SeriesItemCard({ item }: { item: any }) {
  return (
    <Link
      href={`/content/${item.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
    >
      <div className="flex items-start space-x-4 space-x-reverse">
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
            {item.title}
          </h3>

          {item.summary && (
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {item.summary}
            </p>
          )}

          <div className="flex items-center justify-between">
            {item.sub_category && (
              <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                {item.sub_category}
              </span>
            )}

            <div className="flex items-center space-x-2 space-x-reverse text-primary font-semibold text-sm">
              <span>צפה בשיעור</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
