"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Users, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

type DocType = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  isFavorite: boolean;
  isPublic: boolean;
  updatedAt: Date;
  author: { id: string; name: string | null };
  knowledgeBase: { name: string } | null;
};

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function DocViewer({ doc, isAuthor }: { doc: DocType; isAuthor: boolean }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(doc.content, "text/html");
    const headingElements = htmlDoc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const extractedHeadings: Heading[] = [];
    headingElements.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      extractedHeadings.push({
        id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1]),
      });
    });

    setHeadings(extractedHeadings);

    const contentDiv = document.getElementById("doc-content");
    if (contentDiv) {
      contentDiv.innerHTML = htmlDoc.body.innerHTML;
    }
  }, [doc.content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex h-screen">
      {/* 左侧目录 */}
      <aside className="w-64 border-r bg-muted/10 p-6 overflow-auto">
        <h2 className="font-bold text-lg mb-4">目录</h2>
        {headings.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无目录</p>
        ) : (
          <nav className="space-y-2">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className="block w-full text-left text-sm hover:text-primary transition-colors"
                style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        )}
      </aside>

      {/* 右侧内容 */}
      <main className="flex-1 overflow-auto">
        <article className="container mx-auto p-8 max-w-4xl">
          <header className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl font-bold">{doc.title}</h1>
              {isAuthor && (
                <Link href={`/dashboard/docs/${doc.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    编辑
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground mt-4">
              <span>{doc.author.name}</span>
              <span>·</span>
              <span>{new Date(doc.updatedAt).toLocaleDateString("zh-CN")}</span>
              {doc.knowledgeBase && (
                <>
                  <span>·</span>
                  <span>{doc.knowledgeBase.name}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 mt-4">
              {doc.isFavorite && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">已收藏</span>
                </div>
              )}
              {doc.isPublic && (
                <div className="flex items-center gap-1 text-blue-500">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">公开分享</span>
                </div>
              )}
            </div>
          </header>

          <div id="doc-content" className="prose prose-lg max-w-none" />
        </article>
      </main>
    </div>
  );
}
