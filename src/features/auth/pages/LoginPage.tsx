"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { Glow } from "@/components/ui/glow";
import { cn } from "@/lib/utils";

export function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Glow
          variant="above"
          className="animate-appear-zoom opacity-0 [animation-delay:200ms]"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-appear opacity-0 [animation-delay:100ms]">
          <h1
            className={cn(
              "inline-block",
              "bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground",
              "bg-clip-text text-transparent",
              "text-4xl font-bold tracking-tight sm:text-5xl",
              "leading-[1.1]",
              "drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            )}
          >
            로그인
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            계정에 접속하여 서비스를 이용하세요
          </p>
        </div>

        <div className="animate-appear opacity-0 [animation-delay:200ms]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
