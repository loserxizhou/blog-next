"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Github } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  // 自动填充注册后的账号和密码
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const passwordFromStorage = sessionStorage.getItem("register_password");

    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }

    if (passwordFromStorage) {
      setPassword(passwordFromStorage);
      // 清除存储的密码
      sessionStorage.removeItem("register_password");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCredentialsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("邮箱或密码错误");
      } else {
        router.push("/kb");
        router.refresh();
      }
    } catch (error) {
      setError("登录失败，请重试");
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "github" | "google") => {
    try {
      setIsOAuthLoading(true);
      setError("");
      await signIn(provider, { callbackUrl: "/kb" });
    } catch (error) {
      console.error("OAuth login error:", error);
      setError("OAuth 登录失败，请重试");
      setIsOAuthLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={isCredentialsLoading}>
          {isCredentialsLoading ? "登录中..." : "登录"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            或使用
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("github")}
          disabled={isOAuthLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          {isOAuthLoading ? "跳转中..." : "使用 GitHub 登录"}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        还没有账号?{" "}
        <Link href="/register" className="text-primary hover:underline">
          注册
        </Link>
      </p>
    </div>
  );
}
