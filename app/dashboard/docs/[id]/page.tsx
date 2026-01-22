"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

type KnowledgeBase = {
  id: string;
  name: string;
};

export default function EditDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [characterCount, setCharacterCount] = useState({
    characters: 0,
    words: 0,
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(true);

  // 获取文档数据和知识库列表
  useEffect(() => {
    Promise.all([
      fetch(`/api/docs/${id}`).then((res) => res.json()),
      fetch("/api/knowledge-bases").then((res) => res.json()),
    ])
      .then(([docData, kbData]) => {
        setTitle(docData.title);
        setContent(docData.content);
        setKnowledgeBaseId(docData.knowledgeBaseId || null);
        setIsFavorite(docData.isFavorite || false);
        setIsPublic(docData.isPublic || false);

        if (kbData.knowledgeBases) {
          setKnowledgeBases(kbData.knowledgeBases);
        }

        setLoading(false);
        initialLoadRef.current = false;
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

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
    if (!initialLoadRef.current) {
      setHasUnsavedChanges(true);
      setSaveStatus("unsaved");
    }
  }, []);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      setHasUnsavedChanges(true);
      setSaveStatus("unsaved");
    },
    []
  );

  // 自动保存
  useEffect(() => {
    if (!hasUnsavedChanges || !title.trim() || loading) return;

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
  }, [content, title, knowledgeBaseId, isFavorite, isPublic, hasUnsavedChanges, loading]);

  const handleAutoSave = async () => {
    if (!title.trim()) return;

    setSaveStatus("saving");

    try {
      const response = await fetch(`/api/docs/${id}`, {
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
      const response = await fetch(`/api/docs/${id}`, {
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
        router.push("/kb/categories");
        router.refresh();
      } else {
        setSaveStatus("error");
        alert("保存失败");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const selectedKb = knowledgeBases.find((kb) => kb.id === knowledgeBaseId);

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <SaveStatusIndicator />
          </div>

          <div className="flex items-center gap-4">
            {/* 知识库选择 */}
            <Select
              value={knowledgeBaseId || "none"}
              onValueChange={(value) => {
                setKnowledgeBaseId(value === "none" ? null : value);
                setHasUnsavedChanges(true);
                setSaveStatus("unsaved");
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="选择知识库" />
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

            {/* 收藏开关 */}
            <div className="flex items-center gap-2">
              <Star
                className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
              />
              <Switch
                checked={isFavorite}
                onCheckedChange={(checked) => {
                  setIsFavorite(checked);
                  setHasUnsavedChanges(true);
                  setSaveStatus("unsaved");
                }}
              />
            </div>

            {/* 公开开关 */}
            <div className="flex items-center gap-2">
              <Globe
                className={`h-4 w-4 ${isPublic ? "text-blue-500" : "text-muted-foreground"}`}
              />
              <Switch
                checked={isPublic}
                onCheckedChange={(checked) => {
                  setIsPublic(checked);
                  setHasUnsavedChanges(true);
                  setSaveStatus("unsaved");
                }}
              />
            </div>

            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 标题输入 */}
        <input
          type="text"
          placeholder="无标题"
          value={title}
          onChange={handleTitleChange}
          className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-8"
        />

        {/* 编辑器 */}
        <TiptapEditor
          content={content}
          onChange={handleContentChange}
          placeholder="开始编写文档..."
          onCharacterCountChange={setCharacterCount}
        />

        {/* 底部状态栏 */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{characterCount.characters} 字符</span>
            <span>{characterCount.words} 词</span>
          </div>
          {selectedKb && <span>知识库: {selectedKb.name}</span>}
        </div>
      </div>
    </div>
  );
}
