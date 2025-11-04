import { $t } from "@/plugins/i18n";
import { fighting } from "@/router/enums";

export default {
  path: "/fighting",
  meta: {
    title: $t("menus.loveStore"),
    rank: fighting
  },
  children: [
    {
      path: "/fighting/index",
      name: "Fighting",
      component: () => import("@/views/fighting/index.vue"),
      meta: {
        title: $t("menus.loveIndex"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
