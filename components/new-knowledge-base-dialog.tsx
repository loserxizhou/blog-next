"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NewKnowledgeBaseDialogProps {
  trigger?: React.ReactNode;
}

export function NewKnowledgeBaseDialog({ trigger }: NewKnowledgeBaseDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("请输入知识库名称");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/knowledge-bases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "创建失败");
      }

      setOpen(false);
      setName("");
      setDescription("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setName("");
      setDescription("");
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            新建知识库
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e6f7ef] flex items-center justify-center">
              <FolderPlus className="h-4 w-4 text-[#00b96b]" />
            </div>
            新建知识库
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入知识库名称"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#00b96b] focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              简介
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入知识库简介（可选）"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#00b96b] focus:border-transparent resize-none"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#00b96b] hover:bg-[#00a65d] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  创建中...
                </>
              ) : (
                "创建"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
