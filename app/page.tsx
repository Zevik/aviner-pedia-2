import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VideoCarousel } from '@/components/VideoCarousel';
import { SeriesCard } from '@/components/SeriesCard';
import { QAListItem } from '@/components/QAListItem';
import {
  getLatestArticle,
  getLatestVideos,
  getSeriesGroups,
  getLatestQA,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data for all sections
  const [featuredArticle, latestVideos, seriesGroups, latestQA] = await Promise.all([
    getLatestArticle(),
    getLatestVideos(12),
    getSeriesGroups(8),
    getLatestQA(10),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section - Featured Article */}
      {featuredArticle && (
        <section className="bg-gradient-to-l from-primary/5 to-primary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="text-sm text-primary font-semibold mb-3">
                  מאמר מומלץ
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {featuredArticle.title}
                </h1>
                {featuredArticle.summary && (
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {featuredArticle.summary}
                  </p>
                )}
                <Link
                  href={`/content/${featuredArticle.id}`}
                  className="inline-flex items-center space-x-2 space-x-reverse px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  <span>קרא עוד</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Carousel Section */}
      {latestVideos.length > 0 && (
        <div className="bg-white py-8">
          <VideoCarousel videos={latestVideos} title="סרטונים אחרונים" />
        </div>
      )}

      {/* Series Grid Section */}
      {seriesGroups.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">סדרות לימוד</h2>
              <Link
                href="/series"
                className="text-primary hover:text-primary/80 transition-colors font-semibold flex items-center space-x-2 space-x-reverse"
              >
                <span>צפה בהכל</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {seriesGroups.map((series: any) => (
                <SeriesCard
                  key={series.sub_category}
                  title={series.title}
                  sub_category={series.sub_category}
                  count={series.count}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Q&A List Section */}
      {latestQA.length > 0 && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">שאלות ותשובות אחרונות</h2>
              <Link
                href="/qa"
                className="text-primary hover:text-primary/80 transition-colors font-semibold flex items-center space-x-2 space-x-reverse"
              >
                <span>צפה בהכל</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {latestQA.map((qa) => (
                <QAListItem key={qa.id} item={qa} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
