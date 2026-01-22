import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { RecentDocsTabs } from "@/components/recent-docs-tabs";
import { QuickActions } from "@/components/quick-actions";

export default async function KnowledgeBaseHomePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const recentDocs = await prisma.doc.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: {
      knowledgeBase: {
        select: { name: true },
      },
    },
  });

  return (
    <div className="min-h-full">
      <div className="px-8 py-8">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-foreground mb-1">
            {getGreeting()}，{session.user.name || "用户"}
          </h1>
          <p className="text-[14px] text-muted-foreground">
            使用唤起创作灵感，让知识发挥更大价值
          </p>
        </div>

        {/* 快速入口 */}
        <QuickActions />

        {/* 快速访问 */}
        <RecentDocsTabs docs={recentDocs} />
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "夜深了";
}
