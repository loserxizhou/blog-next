import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function PostsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
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
          <h1 className="text-3xl font-bold mb-2">我的文章</h1>
          <p className="text-muted-foreground">管理你的所有博客文章</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">还没有任何文章</p>
          <Link href="/dashboard/posts/new">
            <Button>创建第一篇文章</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 hover:bg-accent transition-colors"
            >
              <Link href={`/dashboard/posts/${post.id}`}>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                )}
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>
                    {post.published ? "已发布" : "草稿"}
                  </span>
                  <span>
                    更新于 {new Date(post.updatedAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
