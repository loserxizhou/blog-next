import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DocsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const docs = await prisma.doc.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">我的文档</h1>
          <p className="text-muted-foreground">管理你的所有文档</p>
        </div>
        <Link href="/dashboard/docs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建文档
          </Button>
        </Link>
      </div>

      {docs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">还没有任何文档</p>
          <Link href="/dashboard/docs/new">
            <Button>创建第一份文档</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="border rounded-lg p-4 hover:bg-accent transition-colors"
            >
              <Link href={`/dashboard/docs/${doc.id}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{doc.title}</h3>
                    {doc.category && (
                      <span className="text-sm text-muted-foreground">
                        知识库: {doc.category}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    更新于 {new Date(doc.updatedAt).toLocaleDateString("zh-CN")}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
