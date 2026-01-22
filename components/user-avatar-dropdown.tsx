"use client";

import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { User, Moon, Sun, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserAvatarDropdownProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserAvatarDropdown({ user }: UserAvatarDropdownProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-muted flex items-center justify-center hover:bg-gray-300 dark:hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00b96b] focus:ring-offset-2">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "用户头像"}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="w-48">
        {user?.name && (
          <>
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{user.name}</p>
              {user.email && (
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 mr-2" />
              浅色模式
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 mr-2" />
              深色模式
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings className="h-4 w-4 mr-2" />
          个人设置
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
        >
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
