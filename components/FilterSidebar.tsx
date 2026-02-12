'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

interface FilterSidebarProps {
  categories: string[];
  currentCategory?: string;
  basePath: string;
}

export function FilterSidebar({ categories, currentCategory, basePath }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (category: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (category) {
      params.set('topic', category);
    } else {
      params.delete('topic');
    }

    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <aside className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
      <div className="flex items-center space-x-2 space-x-reverse mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">סינון לפי נושא</h3>
      </div>

      <div className="space-y-2">
        {/* "All" option */}
        <button
          onClick={() => handleFilterChange(null)}
          className={`w-full text-right px-4 py-2 rounded-lg transition-colors ${
            !currentCategory
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-secondary'
          }`}
        >
          הכל
        </button>

        {/* Category options */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleFilterChange(category)}
            className={`w-full text-right px-4 py-2 rounded-lg transition-colors ${
              currentCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </aside>
  );
}
