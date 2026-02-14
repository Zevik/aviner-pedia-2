import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/wiki');

export function getAllPosts() {
  // קורא את כל הקבצים בתיקייה
  const fileNames = fs.readdirSync(contentDirectory);
  
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, ''); // מסיר סיומת
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      ...data, // כולל title, type וכו'
      content,
    };
  });

  // מסנן דפים ריקים (כמו הפניות)
  return allPostsData.filter(post => post.content.trim().length > 0);
}

export function getPostBySlug(slug: string) {
  try {
    // פענוח ה-Slug (כי הדפדפן מקודד עברית ל-%D7...)
    const realSlug = decodeURIComponent(slug);
    const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return { slug: realSlug, data, content };
  } catch (error) {
    return null;
  }
}
