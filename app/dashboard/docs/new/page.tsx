"use client";

import { useState, useEffect, useCallback, useRef, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Star,
  Globe,
  Clock,
  Check,
  AlertCircle,
  Loader2,
  FileText,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

type KnowledgeBase = {
  id: string;
  name: string;
};

type DocItem = {
  id: string;
  title: string;
  updatedAt: string;
};

type Heading = {
  id: string;
  text: string;
  level: number;
};

function NewDocPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [kbDocs, setKbDocs] = useState<DocItem[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [characterCount, setCharacterCount] = useState({ characters: 0, words: 0 });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 从内容中提取标题
  const extractHeadings = useCallback((htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const headingElements = doc.querySelectorAll("h1, h2, h3");
    const extracted: Heading[] = [];
    headingElements.forEach((heading, index) => {
      extracted.push({
        id: `heading-${index}`,
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1]),
      });
    });
    setHeadings(extracted);
  }, []);

  // 获取知识库列表
  useEffect(() => {
    fetch("/api/knowledge-bases")
      .then((res) => res.json())
      .then((data) => {
        if (data.knowledgeBases) {
          setKnowledgeBases(data.knowledgeBases);
        }
      })
      .catch(() => {});
  }, []);

  // 检查是否有导入的内容
  useEffect(() => {
    if (searchParams.get("import") === "true") {
      const importedData = sessionStorage.getItem("importedDoc");
      if (importedData) {
        try {
          const { title: importedTitle, content: importedContent } = JSON.parse(importedData);
          setTitle(importedTitle || "");
          setContent(importedContent || "");
          extractHeadings(importedContent || "");
          setHasUnsavedChanges(true);
          setSaveStatus("unsaved");
          sessionStorage.removeItem("importedDoc");
        } catch {
          // 解析失败，忽略
        }
      }
    }
  }, [searchParams, extractHeadings]);

  // 当知识库变化时，获取该知识库的文档列表
  useEffect(() => {
    if (knowledgeBaseId) {
      fetch(`/api/knowledge-bases/${knowledgeBaseId}/docs`)
        .then((res) => res.json())
        .then((data) => {
          if (data.docs) {
            setKbDocs(data.docs);
          }
        })
        .catch(() => {
          setKbDocs([]);
        });
    } else {
      setKbDocs([]);
    }
  }, [knowledgeBaseId]);

  // 离开页面确认
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 内容变化时标记未保存
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    extractHeadings(newContent);
    setHasUnsavedChanges(true);
    setSaveStatus("unsaved");
  }, [extractHeadings]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
    setSaveStatus("unsaved");
  }, []);

  // 自动保存
  useEffect(() => {
    if (!hasUnsavedChanges || !title.trim()) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      handleAutoSave();
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, title, knowledgeBaseId, isFavorite, isPublic, hasUnsavedChanges]);

  const handleAutoSave = async () => {
    if (!title.trim()) return;

    setSaveStatus("saving");

    try {
      if (docId) {
        // 更新已有文档
        const response = await fetch(`/api/docs/${docId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            knowledgeBaseId: knowledgeBaseId || undefined,
            isFavorite,
            isPublic,
          }),
        });

        if (response.ok) {
          setSaveStatus("saved");
          setHasUnsavedChanges(false);
        } else {
          setSaveStatus("error");
        }
      } else {
        // 创建新文档
        const response = await fetch("/api/docs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            knowledgeBaseId: knowledgeBaseId || undefined,
            isFavorite,
            isPublic,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setDocId(data.doc.id);
          setSaveStatus("saved");
          setHasUnsavedChanges(false);
        } else {
          setSaveStatus("error");
        }
      }
    } catch {
      setSaveStatus("error");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("请输入标题");
      return;
    }

    setSaving(true);
    setSaveStatus("saving");

    try {
      if (docId) {
        const response = await fetch(`/api/docs/${docId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            knowledgeBaseId: knowledgeBaseId || undefined,
            isFavorite,
            isPublic,
          }),
        });

        if (response.ok) {
          setSaveStatus("saved");
          setHasUnsavedChanges(false);
        } else {
          setSaveStatus("error");
          alert("保存失败");
        }
      } else {
        const response = await fetch("/api/docs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            knowledgeBaseId: knowledgeBaseId || undefined,
            isFavorite,
            isPublic,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setDocId(data.doc.id);
          setSaveStatus("saved");
          setHasUnsavedChanges(false);
        } else {
          setSaveStatus("error");
          alert("保存失败");
        }
      }
    } catch {
      setSaveStatus("error");
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (confirm("有未保存的更改，确定要离开吗？")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const SaveStatusIndicator = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 animate-spin" />
            保存中...
          </span>
        );
      case "saved":
        return (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <Check className="h-4 w-4" />
            已保存
          </span>
        );
      case "unsaved":
        return (
          <span className="flex items-center gap-1 text-sm text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            未保存
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            保存失败
          </span>
        );
    }
  };

  const selectedKb = useMemo(
    () => knowledgeBases.find((kb) => kb.id === knowledgeBaseId),
    [knowledgeBases, knowledgeBaseId]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center px-4 py-2 gap-4">
          {/* 左侧：返回 + 保存状态 */}
          <div className="flex items-center gap-3 w-64 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={handleBack} className="flex-shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <SaveStatusIndicator />
          </div>

          {/* 中间：标题 */}
          <div className="flex-1 flex justify-center">
            <input
              type="text"
              placeholder="无标题"
              value={title}
              onChange={handleTitleChange}
              className="w-full max-w-md text-center text-base font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
            />
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center gap-2 w-64 flex-shrink-0 justify-end">
            {/* 知识库选择 */}
            <Select
              value={knowledgeBaseId || "none"}
              onValueChange={(value) => {
                setKnowledgeBaseId(value === "none" ? null : value);
                setHasUnsavedChanges(true);
                setSaveStatus("unsaved");
              }}
            >
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue placeholder="知识库" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无知识库</SelectItem>
                {knowledgeBases.map((kb) => (
                  <SelectItem key={kb.id} value={kb.id}>
                    {kb.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 收藏 */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setIsFavorite(!isFavorite);
                setHasUnsavedChanges(true);
                setSaveStatus("unsaved");
              }}
            >
              <Star
                className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
              />
            </Button>

            {/* 公开 */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setIsPublic(!isPublic);
                setHasUnsavedChanges(true);
                setSaveStatus("unsaved");
              }}
            >
              <Globe
                className={`h-4 w-4 ${isPublic ? "text-blue-500" : "text-muted-foreground"}`}
              />
            </Button>

            <Button size="sm" onClick={handleSave} disabled={saving} className="h-8">
              <Save className="h-4 w-4 mr-1" />
              {saving ? "保存中" : "保存"}
            </Button>
          </div>
        </div>
      </div>

      {/* 三栏布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：文档列表 */}
        <aside className="w-64 border-r bg-muted/10 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {selectedKb ? selectedKb.name : "文档列表"}
            </h3>
            {knowledgeBaseId ? (
              kbDocs.length > 0 ? (
                <nav className="space-y-1">
                  {kbDocs.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/dashboard/docs/${doc.id}`}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                        "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{doc.title}</span>
                    </Link>
                  ))}
                </nav>
              ) : (
                <p className="text-sm text-muted-foreground px-3">暂无文档</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground px-3">
                选择知识库后显示文档列表
              </p>
            )}
          </div>
        </aside>

        {/* 中间：编辑器 */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* 编辑器 */}
          <TiptapEditor
            content={content}
            onChange={handleContentChange}
            placeholder="开始编写文档..."
            onCharacterCountChange={setCharacterCount}
          />

          {/* 底部状态栏 */}
          <div className="fixed bottom-4 right-72 text-xs text-muted-foreground">
            <span>{characterCount.characters} 字符</span>
            <span className="mx-2">·</span>
            <span>{characterCount.words} 词</span>
          </div>
        </main>

        {/* 右侧：大纲 */}
        <aside className="w-56 border-l bg-muted/10 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <List className="h-4 w-4" />
              大纲
            </h3>
            {headings.length > 0 ? (
              <nav className="space-y-1">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors truncate px-2 py-1 rounded hover:bg-muted"
                    style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
                    onClick={() => {
                      // 滚动到对应标题
                      const editorContent = document.querySelector('.ProseMirror');
                      if (editorContent) {
                        const headingElements = editorContent.querySelectorAll('h1, h2, h3');
                        const targetHeading = headingElements[headings.indexOf(heading)];
                        targetHeading?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                  >
                    {heading.text || "无标题"}
                  </button>
                ))}
              </nav>
            ) : (
              <p className="text-sm text-muted-foreground px-2">
                添加标题后显示大纲
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function NewDocPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <NewDocPageContent />
    </Suspense>
  );
}
