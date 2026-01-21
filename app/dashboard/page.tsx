import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, Settings } from "lucide-react";

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>博客文章</CardTitle>
            <CardDescription>管理你的博客文章</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/posts">
              <Button className="w-full">管理文章</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>文档</CardTitle>
            <CardDescription>管理你的文档</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/docs">
              <Button className="w-full">管理文档</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Settings className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>设置</CardTitle>
            <CardDescription>账号和系统设置</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/settings">
              <Button className="w-full" variant="outline">
                前往设置
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
