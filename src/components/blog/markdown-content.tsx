'use client';

import type { ReactElement } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Copy, Check } from "lucide-react";

type MarkdownContentProps = {
  readonly content: string;
};

function CodeBlock({ 
  language, 
  children 
}: { 
  readonly language?: string; 
  readonly children: string;
}): ReactElement {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg bg-surface/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface"
          aria-label="Копировать код"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent" />
              Скопировано
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Копировать
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'typescript'}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          padding: '1.5rem',
          fontSize: '0.875rem',
        }}
        showLineNumbers
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export function MarkdownContent({ content }: MarkdownContentProps): ReactElement {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : undefined;
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="rounded bg-accent/10 px-1.5 py-0.5 text-sm font-mono text-accent"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={language}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          h1: ({ children }) => (
            <h1 className="font-heading text-4xl md:text-5xl mb-6 mt-8 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-heading text-3xl md:text-4xl mb-4 mt-8 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-heading text-2xl md:text-3xl mb-3 mt-6 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground my-4">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 underline transition-colors"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

