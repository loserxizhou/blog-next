"use client";

import Link from "next/link";
import { Plus, FolderPlus } from "lucide-react";
import { NewKnowledgeBaseDialog } from "@/components/new-knowledge-base-dialog";

export function QuickActions() {
  return (
    <div className="flex gap-3 mb-8">
      <Link href="/dashboard/docs/new">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#00b96b] hover:bg-[#00a65d] text-white text-[14px] font-medium rounded-md transition-colors">
          <Plus className="h-4 w-4" />
          新建文档
        </button>
      </Link>
      <NewKnowledgeBaseDialog
        trigger={
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted border border-gray-200 dark:border-border text-[14px] font-medium rounded-md transition-colors">
            <FolderPlus className="h-4 w-4" />
            新建知识库
          </button>
        }
      />
    </div>
  );
}
