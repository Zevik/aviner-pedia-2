import { getPostBySlug, getAllPosts } from '@/lib/wiki';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function WikiPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return <div className="p-10 text-center">הדף לא נמצא</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <h1 className="text-4xl font-bold mb-4 text-blue-800">{post.data.title}</h1>
      
      {/* תגית הקטגוריה */}
      <div className="mb-8">
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
          {post.data.type || 'כללי'}
        </span>
      </div>

      {/* תוכן המאמר */}
      <article className="prose prose-lg max-w-none prose-headings:text-blue-700">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}
