<script setup lang="ts">
import { ref, watch } from "vue";
// import tree from "./tree.vue";
import { useHook } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Upload from "~icons/ri/upload-line";
import Role from "~icons/ri/admin-line";
import Password from "~icons/ri/lock-password-line";
import More from "~icons/ep/more-filled";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import Download from "~icons/ep/download";
import Search from "~icons/ep/search";
import { useUserStoreHook } from "@/store/modules/user";

defineOptions({
  name: "SystemUser"
});

const formRef = ref();
const {
  searchFormParams,
  pageLoading,
  columns,
  dataList,
  pagination,
  buttonClass,
  onSearch,
  resetForm,
  exportAllExcel,
  openResetPasswordDialog,
  handleDelete,
  openDialog,
  getList,
  openUploadDialog
} = useHook();

// watch(
//   () => searchFormParams.deptId,
//   () => {
//     onSearch();
//   }
// );
</script>

<template>
  <div class="main">
    <!-- <tree class="w-[17%] float-left" v-model="searchFormParams.deptId" /> -->
    <!-- <div class="float-right w-[82%]"> -->
    <div>
      <el-form
        ref="formRef"
        :inline="true"
        :model="searchFormParams"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input
            v-model="searchFormParams.username"
            placeholder="请输入用户名"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone_number">
          <el-input
            v-model="searchFormParams.phone_number"
            placeholder="请输入手机号码"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="searchFormParams.status"
            placeholder="请选择"
            clearable
            class="!w-[160px]"
          >
            <el-option
              v-for="dict in useUserStoreHook().dictionaryList['common.status']"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon(Search)"
            :loading="pageLoading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <PureTableBar title="管理员列表" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog('新增')"
          >
            新增管理员
          </el-button>
          <el-button
            type="info"
            :icon="useRenderIcon(Upload)"
            @click="openUploadDialog"
          >
            导入
          </el-button>
          <el-button
            type="warning"
            :icon="useRenderIcon(Download)"
            @click="exportAllExcel"
          >
            导出
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            adaptive
            align-whole="center"
            table-layout="auto"
            :loading="pageLoading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="{
              background: 'var(--el-table-row-hover-bg-color)',
              color: 'var(--el-text-color-primary)'
            }"
            @page-size-change="getList"
            @page-current-change="getList"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openDialog('编辑', row)"
                :icon="useRenderIcon(EditPen)"
                v-if="row.is_admin == 0"
              >
                修改
              </el-button>
              <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                    v-if="row.is_admin == 0"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
              <el-dropdown>
                <el-button
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(More)"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Password)"
                        @click="openResetPasswordDialog(row)"
                      >
                        重置密码
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
