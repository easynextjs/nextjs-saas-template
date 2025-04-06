"use client";

import { WorkspaceMember } from "../schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type MembersListProps = {
  members: WorkspaceMember[];
};

export function MembersList({ members }: MembersListProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white dark:bg-neutral-800",
        "border border-neutral-100/80 dark:border-neutral-700/50",
        "shadow-sm p-6 flex flex-col",
        "transition-all duration-300"
      )}
    >
      <h2 className="text-lg font-semibold mb-4 text-foreground">팀원 목록</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>가입일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>
                  {member.role === "owner" ? (
                    <Badge className="bg-blue-500">관리자</Badge>
                  ) : (
                    <Badge variant="outline">게스트</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(member.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  팀원이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
