"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders model output. react-markdown never injects raw HTML, so a prompt-injected
 * <script> or <img onerror> in a transaction description stays inert text.
 */
export function Markdown({ children }: { children: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ children }) => <p className="leading-relaxed [&:not(:last-child)]:mb-2">{children}</p>,
                ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                h1: ({ children }) => <h3 className="mb-1 mt-2 font-semibold">{children}</h3>,
                h2: ({ children }) => <h3 className="mb-1 mt-2 font-semibold">{children}</h3>,
                h3: ({ children }) => <h3 className="mb-1 mt-2 font-semibold">{children}</h3>,
                a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="text-primary underline underline-offset-2">
                        {children}
                    </a>
                ),
                code: ({ children }) => (
                    <code className="rounded bg-background/60 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
                ),
                table: ({ children }) => (
                    <div className="my-2 overflow-x-auto">
                        <table className="w-full border-collapse text-xs">{children}</table>
                    </div>
                ),
                th: ({ children }) => <th className="border-b px-2 py-1 text-left font-medium">{children}</th>,
                td: ({ children }) => <td className="border-b px-2 py-1">{children}</td>,
            }}
        >
            {children}
        </ReactMarkdown>
    );
}
