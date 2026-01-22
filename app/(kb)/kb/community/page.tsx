import { prisma } from "@/lib/db";
import Link from "next/link";
import { Users, FileText, ChevronRight } from "lucide-react";

export default async function CommunityPage() {
  const publicDocs = await prisma.doc.findMany({
    where: {
      isPublic: true,
      published: true,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-[#f0f5ff] dark:bg-blue-950/50 flex items-center justify-center">
          <Users className="h-5 w-5 text-[#1677ff] dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold">社区</h1>
          <p className="text-[14px] text-muted-foreground">公开分享的文档</p>
        </div>
      </div>

      {publicDocs.length === 0 ? (
        <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-muted flex items-center justify-center mb-3">
              <Users className="h-5 w-5 text-gray-400 dark:text-muted-foreground" />
            </div>
            <p className="text-[14px] text-muted-foreground">暂无公开分享的文档</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border overflow-hidden">
          {publicDocs.map((doc, index) => (
            <Link
              key={doc.id}
              href={`/doc/${doc.id}`}
              target="_blank"
              className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors group ${
                index !== publicDocs.length - 1 ? "border-b border-gray-100 dark:border-border" : ""
              }`}
            >
              <div className="w-8 h-8 rounded bg-[#e6f7ef] dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-[#00b96b] dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-foreground truncate">
                  {doc.title}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {doc.author.name} · {doc.category || "未归类"} · {formatDate(doc.updatedAt)}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 dark:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  return d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}
