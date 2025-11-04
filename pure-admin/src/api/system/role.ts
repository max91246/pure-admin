import { http } from "@/utils/http";

export interface RoleQuery extends BasePageQuery {
  key?: string;
  name?: string;
  status?: string;
  time_range_column?: string;
}

export interface RoleDTO {
  create_time: Date;
  dataScope: number;
  remark: string;
  id: number;
  key: string;
  name: string;
  sort_num: number;
  selectedDeptList: number[];
  menu_ids: number[];
  status: string;
}

export function getAllRoleApi() {
  return http.request<ResponseData<Array<RoleDTO>>>(
    "get",
    "/admin/role/all"
  );
}

export function getRoleListApi(params: RoleQuery) {
  return http.request<ResponseData<PageDTO<RoleDTO>>>(
    "get",
    "/admin/role/list",
    {
      params
    }
  );
}

export function getRoleInfoApi(roleId: number) {
  return http.request<ResponseData<RoleDTO>>("get", "/admin/role/info", {
    params: { id: roleId }
  });
}

export interface AddRoleCommand {
  data_scope?: string;
  menu_ids: number[];
  remark?: string;
  key: string;
  name: string;
  sort_num: number;
  status?: string;
}

export function addRoleApi(data: AddRoleCommand) {
  return http.request<void>("post", "/admin/role/create", {
    data
  });
}

export interface UpdateRoleCommand extends AddRoleCommand {
  id: number;
}

export function updateRoleApi(data: UpdateRoleCommand) {
  return http.request<void>("post", "/admin/role/update", {
    data
  });
}

export function deleteRoleApi(roleId: number) {
  return http.request<void>("post", "/admin/role/delete", {
    data: { id: roleId }
  });
}

export function updateRoleStatusApi(roleId: number, status: string) {
  return http.request<void>("post", "/admin/role/updateStatus", {
    data: {
      id: roleId,
      status: status
    }
  });
}
