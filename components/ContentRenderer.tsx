import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function ContentRenderer({ content, className = '' }: ContentRendererProps) {
  // Clean and fix markdown syntax issues from source data
  const cleanedContent = content
    // Stage 1: Fix patterns with trailing punctuation: * text*' -> **text**
    .replace(/\* ([^*\n]+)\*['|"]/g, '**$1**')
    // Stage 2: Fix * *text:** -> **text:**
    .replace(/\* \*([^*]+):\*\*/g, '**$1:**')
    // Stage 3: Fix * *text** (at end or before space/newline) -> **text**
    .replace(/\* \*([^*]+)\*\*(?=\s|$)/g, '**$1**')
    // Stage 4: Fix * text:* -> **text:**
    .replace(/\* ([^*\n]+):\*/g, '**$1:**')
    // Stage 5: Fix * text* (standalone) -> **text**
    .replace(/\* ([^*\n]+)\*(?=\s|$)/g, '**$1**')
    // Stage 6: Remove standalone * * lines
    .replace(/^\* \*\s*$/gm, '')
    // Stage 7: Remove orphaned asterisks
    .replace(/^\*\s*\n/gm, '\n');

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize heading styles
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
          ),
          // Customize list styles
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-2 my-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 my-4" {...props} />
          ),
          // Customize paragraph
          p: ({ node, ...props }) => (
            <p className="leading-relaxed mb-4" {...props} />
          ),
          // Customize blockquote
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-r-4 border-primary/30 pr-4 italic my-4 text-muted-foreground" {...props} />
          ),
          // Customize links
          a: ({ node, ...props }) => (
            <a className="text-primary hover:underline" {...props} />
          ),
          // Customize bold/strong text
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-gray-900" {...props} />
          ),
          // Customize italic/emphasis text
          em: ({ node, ...props }) => (
            <em className="italic text-gray-800" {...props} />
          ),
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
    </div>
  );
}
