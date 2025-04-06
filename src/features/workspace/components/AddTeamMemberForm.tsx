"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addWorkspaceUser } from "../api";
import { useToast } from "@/hooks/use-toast";
import { userRoleEnum, userRoleLabel } from "@/constants/user-role";

// 폼 스키마 정의
const formSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  role: z.enum(userRoleEnum, {
    required_error: "권한을 선택해주세요.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTeamMemberFormProps {
  workspaceId: number;
  onMemberAdded: () => void;
}

export function AddTeamMemberForm({
  workspaceId,
  onMemberAdded,
}: AddTeamMemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "guest",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await addWorkspaceUser({
        ...data,
        workspaceId,
      });

      toast({
        title: "팀원 추가 성공",
        description: "새 팀원이 워크스페이스에 추가되었습니다.",
      });

      // 폼 초기화
      reset();

      // 부모 컴포넌트에 알림
      onMemberAdded();
    } catch (error: any) {
      let message = "팀원 추가에 실패했습니다.";
      if (error?.message?.includes("이미 등록된 팀원")) {
        message = "이미 등록된 팀원입니다.";
      } else if (error?.message?.includes("사용자를 찾을 수 없")) {
        message = "해당 이메일의 사용자를 찾을 수 없습니다.";
      }

      toast({
        title: "팀원 추가 오류",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="user@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">권한</Label>
        <Select
          defaultValue="guest"
          onValueChange={(value) => setValue("role", value as any)}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="권한을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {userRoleEnum.map((role) => (
              <SelectItem key={role} value={role}>
                {userRoleLabel[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "처리 중..." : "팀원 추가"}
      </Button>
    </form>
  );
}
