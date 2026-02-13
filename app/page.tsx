import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VideoCarousel } from '@/components/VideoCarousel';
import { SeriesCard } from '@/components/SeriesCard';
import { QAListItem } from '@/components/QAListItem';
import {
  getLatestVideos,
  getSeriesGroups,
  getLatestQA,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data for all sections (removed featuredArticle)
  const [latestVideos, seriesGroups, latestQA] = await Promise.all([
    getLatestVideos(12),
    getSeriesGroups(8),
    getLatestQA(10),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Site Header / Cover */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo/Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-5xl">📚</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 leading-tight">
              אבינרפדיה
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-medium">
              כל שיעורי הרב שלמה אבינר שליט"א
            </p>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              מאגר מקיף של אלפי שיעורים, מאמרים ושו"ת הלכה מאת הרב שלמה אבינר
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/videos"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg font-semibold"
              >
                סרטונים
              </Link>
              <Link
                href="/articles"
                className="px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
              >
                מאמרים
              </Link>
              <Link
                href="/qa"
                className="px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
              >
                שו"ת הלכה
              </Link>
              <Link
                href="/series"
                className="px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
              >
                סדרות
              </Link>
            </div>
          </div>
        </div>
      </section>


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

      {/* French Content Banner */}
      <section className="bg-gradient-to-l from-blue-50 to-blue-100 py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/french"
            className="block max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-4xl">🇫🇷</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Les cours en français
                  </h3>
                  <p className="text-gray-600">
                    שיעורי הרב אבינר בצרפתית
                  </p>
                </div>
              </div>
              <ArrowLeft className="w-6 h-6 text-primary" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
