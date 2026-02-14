import Link from 'next/link';
import { getAllPosts } from '@/lib/wiki';

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="p-8 max-w-6xl mx-auto" dir="rtl">
      <h1 className="text-5xl font-bold mb-8 text-center">אבינרפדיה החדשה 📚</h1>
      <p className="text-center text-gray-600 mb-10">
        מאגר של {posts.length} שיעורים, מאמרים ושו"תים.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.slice(0, 100).map((post: any) => (
          <Link 
            key={post.slug} 
            href={`/wiki/${post.slug}`}
            className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500">{post.type}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
