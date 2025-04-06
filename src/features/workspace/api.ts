import { createMainClient } from "@/lib/remote/main/client";
import {
  AddWorkspaceUserResponse,
  RemoveWorkspaceUserResponse,
  UpdateWorkspaceRequest,
  UpdateWorkspaceResponse,
  type AddWorkspaceUserRequest,
  type RemoveWorkspaceUserRequest,
  type WorkspaceUserListResponse,
} from "./schema";

/**
 * 워크스페이스 멤버 목록을 조회합니다.
 */
export async function getWorkspaceUsers(workspaceId: number) {
  return await createMainClient().get<WorkspaceUserListResponse>(
    `/workspace/${workspaceId}/users`
  );
}

/**
 * 워크스페이스에 새 멤버를 추가합니다.
 */
export async function addWorkspaceUser(data: AddWorkspaceUserRequest) {
  return await createMainClient().post<AddWorkspaceUserResponse>(
    `/workspace/${data.workspaceId}/users`,
    data
  );
}

/**
 * 워크스페이스에서 멤버를 제거합니다.
 */
export async function removeWorkspaceUser(data: RemoveWorkspaceUserRequest) {
  return await createMainClient().delete<RemoveWorkspaceUserResponse>(
    `/workspace/${data.workspaceId}/users/${data.workspaceUserId}`
  );
}

export async function updateWorkspace(data: UpdateWorkspaceRequest) {
  return await createMainClient().patch<UpdateWorkspaceResponse>(
    `/workspace/${data.workspaceId}`,
    data
  );
}
