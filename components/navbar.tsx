"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, LogOut } from "lucide-react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Bloc
          </Link>
          <div className="flex gap-4">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-sm hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              博客
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 text-sm hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              文档
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">控制台</Button>
              </Link>
              <form action="/api/auth/signout" method="POST">
                <Button variant="outline" type="submit">
                  <LogOut className="mr-2 h-4 w-4" />
                  退出
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">登录</Button>
              </Link>
              <Link href="/register">
                <Button>注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
