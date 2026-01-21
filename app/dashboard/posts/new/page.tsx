"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (published: boolean) => {
    if (!title.trim()) {
      alert("请输入标题");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          published,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        alert("保存失败");
      }
    } catch (error) {
      alert("保存失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>新建文章</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="文章标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold"
            />
          </div>
          <div>
            <Input
              placeholder="摘要（可选）"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>
          <div>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="开始写作..."
            />
          </div>
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isLoading}
            >
              保存草稿
            </Button>
            <Button onClick={() => handleSave(true)} disabled={isLoading}>
              发布
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
