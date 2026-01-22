"use client";

import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  CheckSquare,
  Highlighter,
  Code2,
  Minus,
  Unlink,
  TableCellsMerge,
  Plus,
  Trash2,
} from "lucide-react";

interface MenuBarProps {
  editor: Editor;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  shortcut?: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  tooltip,
  shortcut,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={isActive ? "bg-muted" : ""}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {tooltip}
          {shortcut && (
            <span className="ml-2 text-muted-foreground">{shortcut}</span>
          )}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-border mx-1" />;
}

export function MenuBar({ editor }: MenuBarProps) {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("输入链接地址:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("输入图片地址:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="border-b p-2 flex flex-wrap gap-1 sticky top-0 bg-background z-10">
        {/* 文本格式 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="粗体"
          shortcut="⌘B"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="斜体"
          shortcut="⌘I"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="删除线"
          shortcut="⌘⇧S"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          tooltip="行内代码"
          shortcut="⌘E"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          tooltip="高亮"
          shortcut="⌘⇧H"
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* 标题 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          tooltip="标题 1"
          shortcut="⌘⌥1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          tooltip="标题 2"
          shortcut="⌘⌥2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          tooltip="标题 3"
          shortcut="⌘⌥3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* 列表 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="无序列表"
          shortcut="⌘⇧8"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="有序列表"
          shortcut="⌘⇧7"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          tooltip="任务列表"
        >
          <CheckSquare className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* 块级元素 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="引用"
          shortcut="⌘⇧B"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          tooltip="代码块"
          shortcut="⌘⌥C"
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          tooltip="分割线"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* 链接和图片 */}
        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          tooltip="链接"
          shortcut="⌘K"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            tooltip="移除链接"
          >
            <Unlink className="h-4 w-4" />
          </ToolbarButton>
        )}
        <ToolbarButton onClick={addImage} tooltip="图片">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* 表格 */}
        <ToolbarButton
          onClick={insertTable}
          isActive={editor.isActive("table")}
          tooltip="插入表格"
        >
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
        {editor.isActive("table") && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              tooltip="添加列"
            >
              <Plus className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              tooltip="添加行"
            >
              <TableCellsMerge className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              tooltip="删除表格"
            >
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        <Divider />

        {/* 撤销重做 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="撤销"
          shortcut="⌘Z"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="重做"
          shortcut="⌘⇧Z"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  );
}
