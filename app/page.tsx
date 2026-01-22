import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-6xl font-bold mb-6">
          欢迎来到 <span className="text-primary">Bloc</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          个人知识库系统
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/kb">进入知识库</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/login">登录</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
