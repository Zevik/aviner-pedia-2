import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import { FilterSidebar } from '@/components/FilterSidebar';
import { QAListItem } from '@/components/QAListItem';
import { getContentItems, getSubCategories } from '@/lib/db';

interface QAPageProps {
  searchParams: Promise<{ topic?: string }>;
}

export default async function QAPage({ searchParams }: QAPageProps) {
  const params = await searchParams;
  const selectedTopic = params.topic;

  // Fetch Q&A items and categories
  const [qaItems, categories] = await Promise.all([
    getContentItems({
      main_category: 'שו"ת הלכה',
      sub_category: selectedTopic,
      limit: 50,
    }),
    getSubCategories('שו"ת הלכה'),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">שאלות ותשובות</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div>טוען...</div>}>
              <FilterSidebar
                categories={categories}
                currentCategory={selectedTopic}
                basePath="/qa"
              />
            </Suspense>
          </div>

          {/* Content List */}
          <div className="flex-1">
            {selectedTopic && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-muted-foreground">
                  {selectedTopic}
                </h2>
              </div>
            )}

            {qaItems.length > 0 ? (
              <div className="space-y-4 max-w-4xl">
                {qaItems.map((qa) => (
                  <QAListItem key={qa.id} item={qa} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  לא נמצאו שאלות ותשובות
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
