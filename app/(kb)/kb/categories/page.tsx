import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { KnowledgeBaseView } from "@/components/knowledge-base-view";
import { FolderTree } from "lucide-react";
import { NewKnowledgeBaseDialog } from "@/components/new-knowledge-base-dialog";

export default async function CategoriesPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // 获取知识库列表及其文档
  const knowledgeBases = await prisma.knowledgeBase.findMany({
    where: { authorId: session.user.id },
    include: {
      docs: {
        select: {
          id: true,
          title: true,
          updatedAt: true,
          isFavorite: true,
          isPublic: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // 获取未归类的文档（没有关联知识库的文档）
  const uncategorizedDocs = await prisma.doc.findMany({
    where: {
      authorId: session.user.id,
      knowledgeBaseId: null,
    },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      isFavorite: true,
      isPublic: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#e6f7ef] dark:bg-emerald-950/50 flex items-center justify-center">
            <FolderTree className="h-5 w-5 text-[#00b96b] dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold">知识库</h1>
            <p className="text-[14px] text-muted-foreground">管理和浏览你的所有文档</p>
          </div>
        </div>
        <NewKnowledgeBaseDialog />
      </div>

      <KnowledgeBaseView
        knowledgeBases={knowledgeBases}
        uncategorizedDocs={uncategorizedDocs}
      />
    </div>
  );
}
