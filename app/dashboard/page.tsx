import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FolderTree } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">控制台</h1>
        <p className="text-muted-foreground">
          欢迎回来, {session.user?.name || session.user?.email}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>知识库</CardTitle>
            <CardDescription>浏览和管理你的知识库</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/kb">
              <Button className="w-full">进入知识库</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FolderTree className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>文档管理</CardTitle>
            <CardDescription>创建和编辑文档</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/docs">
              <Button className="w-full">管理文档</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
