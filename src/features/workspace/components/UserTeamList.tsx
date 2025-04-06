"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { getWorkspaceUsers, removeWorkspaceUser } from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userRoleLabel } from "@/constants/user-role";
import { type WorkspaceUserListResponse } from "../schema";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface UserTeamListProps {
  workspaceId: number;
  refreshTrigger: number;
  onMemberRemoved: () => void;
}

export function UserTeamList({
  workspaceId,
  refreshTrigger,
  onMemberRemoved,
}: UserTeamListProps) {
  const [users, setUsers] = useState<WorkspaceUserListResponse>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getWorkspaceUsers(workspaceId);
        setUsers(response);
      } catch (error) {
        toast({
          title: "팀원 목록 로드 오류",
          description: "팀원 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [workspaceId, refreshTrigger, toast]);

  const handleRemoveUser = async (workspaceUserId: number) => {
    try {
      setRemoving(workspaceUserId);
      await removeWorkspaceUser({
        workspaceId,
        workspaceUserId,
      });
      toast({
        title: "팀원 제거 완료",
        description: "팀원이 성공적으로 제거되었습니다.",
      });
      onMemberRemoved();
    } catch (error) {
      toast({
        title: "팀원 제거 오류",
        description: "팀원 제거에 실패했습니다.",
        variant: "destructive",
      });
      console.error("Failed to remove user:", error);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">데이터를 불러오는 중...</div>
    );
  }

  if (!users?.length) {
    return <div className="text-center p-4">등록된 팀원이 없습니다.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>권한</TableHead>
            <TableHead>등록일</TableHead>
            <TableHead className="w-[80px]">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{userRoleLabel[user.role]}</TableCell>
              <TableCell>
                {format(new Date(user.createdAt), "yyyy-MM-dd")}
              </TableCell>
              <TableCell>
                {user.role !== "owner" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveUser(user.id)}
                    disabled={removing === user.id}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
