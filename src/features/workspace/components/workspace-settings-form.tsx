"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/lib/supabase/types_db";
import { useWorkspace } from "@/providers/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateWorkspaceRequest, updateWorkspaceSchema } from "../schema";
import { updateWorkspace } from "../api";
import { AdminPageTemplate } from "@/components/templates/admin-page";

interface WorkspaceSettingsFormProps {
  initialData: Tables<"workspace">;
}

export function WorkspaceSettingsForm({
  initialData,
}: WorkspaceSettingsFormProps) {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<UpdateWorkspaceRequest>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      workspaceId: initialData.id,
      name: initialData.name,
    },
  });

  async function onSubmit(values: UpdateWorkspaceRequest) {
    try {
      setIsSubmitting(true);
      setIsSuccess(false);

      await updateWorkspace(values);

      toast({
        title: "성공",
        description: "워크스페이스 정보가 업데이트되었습니다",
      });
      setIsSuccess(true);
      router.refresh();
    } catch (error) {
      toast({
        title: "오류",
        description:
          error instanceof Error ? error.message : "오류가 발생했습니다",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);

      // 3초 후 성공 상태 초기화
      if (isSuccess) {
        setTimeout(() => setIsSuccess(false), 3000);
      }
    }
  }

  return (
    <AdminPageTemplate title="설정">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>워크스페이스 이름</FormLabel>
                  <FormControl>
                    <Input placeholder="워크스페이스 이름" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={isSubmitting} className="relative">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  저장됨
                </>
              ) : (
                "저장하기"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </AdminPageTemplate>
  );
}
