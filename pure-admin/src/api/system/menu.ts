import { http } from "@/utils/http";
import { Tree } from "@/utils/tree";

export interface MenuQuery {
  is_button: boolean;
}

/**
 * MenuDTO
 */
export interface MenuDTO extends Tree {
  create_time?: Date;
  is_button?: number;
  id?: number;
  name?: string;
  parent_id?: number;
  type: number;
  type_desc: string;
  path?: string;
  permission?: string;
  router_name?: string;
  status?: string;
  status_desc?: string;
}

/**
 * MenuDetailDTO
 */
export interface MenuDetailDTO extends MenuDTO {
  meta: MetaDTO;
  permission?: string;
}

/**
 * AddMenuCommand
 */
export interface MenuRequest {
  id: number;
  parent_id: number;
  name: string;
  router_name?: string;
  path?: string;
  permission?: string;
  status: number;
  is_button: boolean;
  type: string;
  meta: MetaDTO;
}

/**
 * MetaDTO
 */
export interface MetaDTO {
  auths?: string[];
  dynamicLevel?: number;
  extraIcon?: ExtraIconDTO;
  frameLoading?: boolean;
  frameSrc?: string;
  hiddenTag?: boolean;
  icon?: string;
  isFrameSrcInternal?: boolean;
  keepAlive?: boolean;
  rank?: number;
  roles?: string[];
  showLink?: boolean;
  showParent?: boolean;
  title?: string;
  transition?: TransitionDTO;
}

/**
 * ExtraIconDTO
 */
export interface ExtraIconDTO {
  name?: string;
  svg?: boolean;
}

/**
 * TransitionDTO
 */
export interface TransitionDTO {
  enterTransition?: string;
  leaveTransition?: string;
  name?: string;
}

/** 获取菜单列表 */
export const getMenuListApi = (params: MenuQuery) => {
  return http.request<ResponseData<Array<MenuDTO>>>("get", "/admin/menu/list", {
    params
  });
};

/** 添加菜单 */
export const addMenuApi = (data: MenuRequest) => {
  return http.request<ResponseData<void>>("post", "/admin/menu/create", { data });
};

/** 修改菜单 */
export const updateMenuApi = (menuId: string, data: MenuRequest) => {
  return http.request<ResponseData<void>>("post", "/admin/menu/update", {
    data
  });
};

/** 删除菜单 */
export const deleteMenuApi = (menuId: string) => {
  return http.request<ResponseData<void>>("post", "/admin/menu/delete", {
    data: { id: menuId }
  });
};

/** 菜单详情 */
export const getMenuInfoApi = (menuId: string) => {
  return http.request<ResponseData<MenuDetailDTO>>("get", "/admin/menu/info", {
    params: { id: menuId }
  });
};
