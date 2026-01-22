"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  List,
  FileText,
  FolderOpen,
  Clock,
  ChevronRight,
  Book,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Doc = {
  id: string;
  title: string;
  updatedAt: Date;
  isFavorite: boolean;
  isPublic: boolean;
};

type KnowledgeBase = {
  id: string;
  name: string;
  description: string | null;
  docs: Doc[];
};

type ViewMode = "grid" | "list";

interface KnowledgeBaseViewProps {
  knowledgeBases: KnowledgeBase[];
  uncategorizedDocs: Doc[];
}

export function KnowledgeBaseView({
  knowledgeBases,
  uncategorizedDocs,
}: KnowledgeBaseViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const totalDocs =
    knowledgeBases.reduce((sum, kb) => sum + kb.docs.length, 0) +
    uncategorizedDocs.length;

  if (knowledgeBases.length === 0 && uncategorizedDocs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Book className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">暂无知识库</h3>
        <p className="text-muted-foreground mb-4">创建你的第一个知识库</p>
      </div>
    );
  }

  return (
    <div>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {knowledgeBases.length} 个知识库，{totalDocs} 篇文档
          </span>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3",
              viewMode === "grid" && "bg-background shadow-sm"
            )}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3",
              viewMode === "list" && "bg-background shadow-sm"
            )}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 分组视图 */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeBases.map((kb) => (
            <KnowledgeBaseCard
              key={kb.id}
              name={kb.name}
              description={kb.description}
              docs={kb.docs}
            />
          ))}
          {uncategorizedDocs.length > 0 && (
            <KnowledgeBaseCard
              name="未归类"
              description="未分配到任何知识库的文档"
              docs={uncategorizedDocs}
              isUncategorized
            />
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {knowledgeBases.map((kb) => (
            <KnowledgeBaseList
              key={kb.id}
              name={kb.name}
              description={kb.description}
              docs={kb.docs}
            />
          ))}
          {uncategorizedDocs.length > 0 && (
            <KnowledgeBaseList
              name="未归类"
              description="未分配到任何知识库的文档"
              docs={uncategorizedDocs}
              isUncategorized
            />
          )}
        </div>
      )}
    </div>
  );
}

// 知识库卡片组件（分组视图）
function KnowledgeBaseCard({
  name,
  description,
  docs,
  isUncategorized = false,
}: {
  name: string;
  description: string | null;
  docs: Doc[];
  isUncategorized?: boolean;
}) {
  const recentDocs = docs.slice(0, 5);
  const hasMore = docs.length > 5;

  return (
    <div className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* 卡片头部 */}
      <div
        className={cn(
          "p-4 border-b",
          isUncategorized
            ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30"
            : "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isUncategorized
                ? "bg-gray-100 dark:bg-gray-800"
                : "bg-[#e6f7ef] dark:bg-emerald-950/50"
            )}
          >
            {isUncategorized ? (
              <Inbox className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <FolderOpen className="h-5 w-5 text-[#00b96b] dark:text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {description || `${docs.length} 篇文档`}
            </p>
          </div>
        </div>
      </div>

      {/* 文档列表 */}
      <div className="divide-y">
        {recentDocs.map((doc) => (
          <Link
            key={doc.id}
            href={`/doc/${doc.id}`}
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 truncate text-sm">{doc.title}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
        {hasMore && (
          <div className="px-4 py-3 text-center">
            <span className="text-sm text-muted-foreground">
              还有 {docs.length - 5} 篇文档
            </span>
          </div>
        )}
        {docs.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            暂无文档
          </div>
        )}
      </div>
    </div>
  );
}

// 知识库列表组件（列表视图）
function KnowledgeBaseList({
  name,
  description,
  docs,
  isUncategorized = false,
}: {
  name: string;
  description: string | null;
  docs: Doc[];
  isUncategorized?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* 列表头部 */}
      <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            isUncategorized
              ? "bg-gray-100 dark:bg-gray-800"
              : "bg-[#e6f7ef] dark:bg-emerald-950/50"
          )}
        >
          {isUncategorized ? (
            <Inbox className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <FolderOpen className="h-4 w-4 text-[#00b96b] dark:text-emerald-400" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <span className="text-sm text-muted-foreground">({docs.length})</span>
      </div>

      {/* 文档表格 */}
      <div className="divide-y">
        {docs.map((doc) => (
          <Link
            key={doc.id}
            href={`/doc/${doc.id}`}
            target="_blank"
            className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors group"
          >
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 truncate">{doc.title}</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDate(doc.updatedAt)}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
        {docs.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            暂无文档
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return "今天";
  } else if (days === 1) {
    return "昨天";
  } else if (days < 7) {
    return `${days} 天前`;
  } else {
    return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  }
}
