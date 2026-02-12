import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">הדף לא נמצא</h2>
        <p className="text-xl text-muted-foreground mb-8">
          מצטערים, הדף שחיפשת אינו קיים
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 space-x-reverse px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>חזרה לעמוד הבית</span>
        </Link>
      </div>
    </div>
  );
}
