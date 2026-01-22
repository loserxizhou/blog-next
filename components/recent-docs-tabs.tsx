"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Clock, Eye, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Doc = {
  id: string;
  title: string;
  updatedAt: Date;
  isFavorite?: boolean;
  isPublic?: boolean;
  knowledgeBase?: { name: string } | null;
};

export function RecentDocsTabs({ docs }: { docs: Doc[] }) {
  const [activeTab, setActiveTab] = useState<"edited" | "viewed">("edited");

  return (
    <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border overflow-hidden">
      {/* 标题和 Tab */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-border">
        <h2 className="text-[15px] font-semibold text-foreground">快速访问</h2>
        <div className="flex items-center gap-1 text-[13px]">
          <button
            onClick={() => setActiveTab("edited")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors",
              activeTab === "edited"
                ? "bg-[#e6f7ef] text-[#00b96b] dark:bg-emerald-950/50 dark:text-emerald-400"
                : "text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-muted"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            编辑过
          </button>
          <button
            onClick={() => setActiveTab("viewed")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors",
              activeTab === "viewed"
                ? "bg-[#e6f7ef] text-[#00b96b] dark:bg-emerald-950/50 dark:text-emerald-400"
                : "text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-muted"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            浏览过
          </button>
        </div>
      </div>

      {/* 文档列表 */}
      <div>
        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-muted flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-gray-400 dark:text-muted-foreground" />
            </div>
            <p className="text-[14px] text-muted-foreground">
              {activeTab === "edited" ? "暂无编辑过的文档" : "暂无浏览记录"}
            </p>
          </div>
        ) : (
          <div>
            {docs.map((doc, index) => (
              <Link
                key={doc.id}
                href={`/doc/${doc.id}`}
                target="_blank"
                className={cn(
                  "flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors group",
                  index !== docs.length - 1 && "border-b border-gray-100 dark:border-border"
                )}
              >
                <div className="w-8 h-8 rounded bg-[#e6f7ef] dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-[#00b96b] dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-foreground truncate">
                    {doc.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    {doc.knowledgeBase?.name || "未归类"} · {formatDate(doc.updatedAt)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>
            ))}
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
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  return d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}
