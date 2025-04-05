"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterPayload, registerPayloadSchema } from "@/features/auth/schema";
import { register as registerApi } from "@/features/auth/api";
import { COOKIE_NAME } from "@/constants/cookie-name";
import { setCookie } from "cookies-next";
import { cn } from "@/lib/utils";
import { Mail, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerPayloadSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerApi(data);
      // 토큰 저장
      setCookie(COOKIE_NAME.ACCESS_TOKEN, response.accessToken);
      // 홈페이지로 리다이렉션
      router.push("/");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.error || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "w-full backdrop-blur-sm",
        "border border-border/40",
        "shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(255,255,255,0.05)]",
        "overflow-hidden"
      )}
    >
      <CardContent className="p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-medium">
                    이름
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="이름을 입력하세요"
                        className="pl-10 bg-background/50 border-border/50 focus:border-brand/60 transition-all"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-medium">
                    이메일
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="이메일을 입력하세요"
                        type="email"
                        className="pl-10 bg-background/50 border-border/50 focus:border-brand/60 transition-all"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-medium">
                    비밀번호
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="비밀번호를 입력하세요 (8자 이상)"
                        type="password"
                        className="pl-10 bg-background/50 border-border/50 focus:border-brand/60 transition-all"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className={cn(
                "w-full mt-2",
                "bg-gradient-to-b from-brand to-brand/90 dark:from-brand/90 dark:to-brand/80",
                "hover:from-brand/95 hover:to-brand/85 dark:hover:from-brand/80 dark:hover:to-brand/70",
                "text-white shadow-md",
                "transition-all duration-300"
              )}
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : "회원가입"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center p-6 pt-0 sm:p-8 sm:pt-0 border-t border-border/10">
        <p className="text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/auth/login"
            className="text-brand hover:text-brand/90 hover:underline font-medium transition-colors"
          >
            로그인
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
