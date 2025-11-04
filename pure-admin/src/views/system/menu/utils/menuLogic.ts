import { isUrl } from "@pureadmin/utils";
import type { MenuRequest } from "@/api/system/menu";
import { getNodeByUniqueId } from "@/utils/tree";
import { CommonUtils } from "@/utils/common";

/**
 * 因为动态路由的逻辑基本上完全依赖前端
 * 所以需要将菜单的数据转换为标准的路由数据
 * @param data
 * @param menuTree
 */
export function transferToStandardRouterData(data: MenuRequest, menuTree: any) {
  // 将菜单名称赋值给meta.title
  if (data.name && data.meta) {
    data.meta.title = data.name;
  }

  // 如果是页面和目录的话  path如果没有/开头 就自动加上
  if (data.type == "PAGE" || data.type == "CATALOG") {
    if (data.path && !data.path.startsWith("/")) {
      data.path = `/${data.path}`;
    }
  }

  // 如果当前菜单是父菜单的唯一节点  记得将当前菜单的showParent=true
  const parentMenu = getNodeByUniqueId(menuTree, data.parent_id);
  // 按钮不需要显示父菜单
  if (parentMenu && !data.is_button) {
    if (!parentMenu.children || parentMenu.children.length === 0) {
      data.meta.showParent = true;
    }
  }

  // 如果是内嵌iframe的话
  if (data.type == "IFRAME") {
    //检测meta.frameSrc是否是以Http/Https开头的 如果不是的话自动补全
    if (data.type == "IFRAME" && data.meta && data.meta.frameSrc) {
      if (!isUrl(data.meta.frameSrc)) {
        // 如果链接是/开头  则认为是内部链接, 打上内部链接标记即可
        if (data.meta.frameSrc.startsWith("/")) {
          data.meta.isFrameSrcInternal = true;
        } else {
          data.meta.frameSrc = `http://${data.meta.frameSrc}`;
        }
      }
    }

    const pinyinStr = CommonUtils.toPinyin(data.name);
    data.path = `/${pinyinStr}IframeLink`;
    data.router_name = `${pinyinStr}IframeRouter`;
  }

  // 如果是外链跳转的话 需要自动设置他的path 按照外链跳转的规则 必须设置成/external
  // 详见https://github.com/pure-admin/vue-pure-admin/issues/664
  // 这里我们直接以菜单名转拼音的方式生成
  if (data.meta && data.type == "REDIRECT") {
    if (!isUrl(data.router_name)) {
      data.router_name = `http://${data.router_name}`;
    }
    data.path = `/external`;
  }
}
