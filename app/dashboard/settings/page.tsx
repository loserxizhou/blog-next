import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SettingsForm } from "@/components/settings-form";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Link href="/kb">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">个人设置</h1>
          <p className="text-muted-foreground mt-1">管理你的账户信息</p>
        </div>
        <SettingsForm user={session.user} />
      </div>
    </div>
  );
}
