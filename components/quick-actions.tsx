"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import { Plus, FolderPlus, FileText, Upload, ChevronDown } from "lucide-react";
import { NewKnowledgeBaseDialog } from "@/components/new-knowledge-base-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function QuickActions() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const html = await marked(text);
    const fileName = file.name.replace(/\.md$/i, "");

    // 存储到 sessionStorage，在新建页面读取
    sessionStorage.setItem("importedDoc", JSON.stringify({ title: fileName, content: html }));
    router.push("/dashboard/docs/new?import=true");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex gap-3 mb-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#00b96b] hover:bg-[#00a65d] text-white text-[14px] font-medium rounded-md transition-colors">
            <Plus className="h-4 w-4" />
            新建文档
            <ChevronDown className="h-3 w-3 ml-1" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => router.push("/dashboard/docs/new")}>
            <FileText className="h-4 w-4 mr-2" />
            空白文档
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            导入 Markdown
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        onChange={handleFileImport}
        className="hidden"
      />

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
