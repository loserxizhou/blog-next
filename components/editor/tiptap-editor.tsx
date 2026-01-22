"use client";

import { useEditor, EditorContent } from "@tiptap/react";
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
          "prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-4",
      },
    },
  });

  if (!editor) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="border-b p-2 h-12 bg-muted/50 animate-pulse" />
        <div className="min-h-[500px] p-8 animate-pulse bg-muted/20" />
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
