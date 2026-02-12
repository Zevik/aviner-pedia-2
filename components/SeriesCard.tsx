import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface SeriesCardProps {
  title: string;
  sub_category: string;
  count: number;
  className?: string;
}

export function SeriesCard({ title, sub_category, count, className = '' }: SeriesCardProps) {
  return (
    <Link
      href={`/series?topic=${encodeURIComponent(sub_category)}`}
      className={`block p-6 bg-white border rounded-lg hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="flex items-start space-x-4 space-x-reverse">
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {count} שיעורים
          </p>
        </div>
      </div>
    </Link>
  );
}
