import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import type { ContentItem } from '@/lib/types';

interface QAListItemProps {
  item: ContentItem;
  className?: string;
}

export function QAListItem({ item, className = '' }: QAListItemProps) {
  return (
    <Link
      href={`/content/${item.id}`}
      className={`block p-4 bg-white border rounded-lg hover:border-primary hover:shadow-md transition-all ${className}`}
    >
      <div className="flex items-start space-x-3 space-x-reverse">
        <div className="flex-shrink-0 mt-1">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>
          {item.sub_category && (
            <span className="inline-block mt-2 text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
              {item.sub_category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
