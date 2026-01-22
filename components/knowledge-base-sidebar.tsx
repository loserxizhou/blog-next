"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderTree, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "开始", href: "/kb" },
  { icon: FolderTree, label: "知识库", href: "/kb/categories" },
  { icon: Star, label: "收藏", href: "/kb/favorites" },
  { icon: Users, label: "社区", href: "/kb/community" },
];

export function KnowledgeBaseSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-gray-200 dark:border-border bg-white dark:bg-card p-4">
      <div className="mb-6">
        <h2 className="text-[16px] font-semibold">知识库</h2>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/kb"
              ? pathname === "/kb"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[14px] transition-colors",
                isActive
                  ? "bg-[#e6f7ef] text-[#00b96b] dark:bg-emerald-950/50 dark:text-emerald-400"
                  : "text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
