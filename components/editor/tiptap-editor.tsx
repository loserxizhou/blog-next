"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Highlight } from "@tiptap/extension-highlight";
import { CharacterCount } from "@tiptap/extension-character-count";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { MenuBar } from "./menu-bar";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  onCharacterCountChange?: (count: { characters: number; words: number }) => void;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "开始写作...",
  editable = true,
  onCharacterCountChange,
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border bg-muted px-3 py-2 text-left font-bold",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border px-3 py-2",
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "not-prose pl-2",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex gap-2 items-start",
        },
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-800 px-1 rounded",
        },
      }),
      CharacterCount,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto",
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      if (onCharacterCountChange) {
        onCharacterCountChange({
          characters: editor.storage.characterCount.characters(),
          words: editor.storage.characterCount.words(),
        });
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg dark:prose-invert focus:outline-none min-h-[500px] px-16 pt-8 pb-4 !max-w-none",
      },
    },
  });

  // 当 editable 属性变化时，更新编辑器状态并聚焦
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
      if (editable) {
        // 延迟聚焦，确保编辑器状态已更新
        setTimeout(() => {
          editor.commands.focus();
        }, 0);
      }
    }
  }, [editor, editable]);

  if (!editor) {
    return (
      <div className="overflow-hidden flex-1 flex flex-col">
        <div className="border-b h-10 bg-muted/50 animate-pulse" />
        <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-4 animate-pulse bg-muted/20" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-background flex-1 flex flex-col">
      {editable && <MenuBar editor={editor} />}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
