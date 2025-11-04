<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./rule";
import { UserRequest } from "@/api/system/user";
import { PostPageResponse } from "@/api/system/post";
import { RoleDTO } from "@/api/system/role";
import { useUserStoreHook } from "@/store/modules/user";

interface FormProps {
  formInline: UserRequest;
  //deptOptions: any[];
  //postOptions: PostPageResponse[];
  roleOptions: RoleDTO[];
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    username: "",
    nickname: "",
    //deptId: 0,
    phone: "",
    email: "",
    password: "",
    sex: 0,
    status: "",
    //postId: 0,
    role_ids: [],
    remark: ""
  }),
  //deptOptions: () => [],
  //postOptions: () => [],
  roleOptions: () => []
});

const newFormInline = ref(props.formInline);
//const deptOptions = ref(props.deptOptions);
const roleOptions = ref(props.roleOptions);
//const postOptions = ref(props.postOptions);

const formRuleRef = ref();

function getFormRuleRef() {
  return formRuleRef.value;
}

defineExpose({ getFormRuleRef });
</script>

<template>
  <el-form
    ref="formRuleRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12">
        <el-form-item label="用户名" prop="username" required>
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
      </re-col>
      <!-- <re-col :value="12">
        <el-form-item label="部门">
          <el-tree-select
            class="w-full"
            v-model="newFormInline.deptId"
            :data="deptOptions"
            :show-all-levels="false"
            value-key="id"
            :props="{
              value: 'id',
              label: 'deptName',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            placeholder="请选择部门"
          />
        </el-form-item>
      </re-col> -->

      <re-col :value="12">
        <el-form-item label="手机号码" prop="phone_number">
          <el-input
            v-model="newFormInline.phone_number"
            clearable
            placeholder="请输入手机号码"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="newFormInline.nickname"
            clearable
            placeholder="请输入昵称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="性别" prop="gender">
          <el-select
            class="w-full"
            v-model="newFormInline.gender"
            placeholder="请选择性别"
            clearable
          >
            <el-option
              v-for="dict in useUserStoreHook().dictionaryList['sysUser.gender']"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <!-- <re-col :value="12">
        <el-form-item label="岗位" prop="postId">
          <el-select
            class="w-full"
            v-model="newFormInline.postId"
            placeholder="请选择岗位"
            clearable
          >
            <el-option
              v-for="item in postOptions"
              :key="item.postId"
              :label="item.postName"
              :value="item.postId"
              :disabled="item.status == 'DISABLED'"
            />
          </el-select>
        </el-form-item>
      </re-col> -->

      <re-col :value="12">
        <el-form-item label="角色" prop="role_ids" required>
          <el-select
            class="w-full"
            v-model="newFormInline.role_ids"
            placeholder="请选择角色"
            clearable
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.status == 'DISABLED'"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="状态" prop="status" required>
          <el-radio-group v-model="newFormInline.status">
            <el-radio
              v-for="item in useUserStoreHook().dictionaryList['common.status']"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col :value="12" v-if="newFormInline.password !== undefined">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            placeholder="请输入密码"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="newFormInline.remark"
            clearable
            placeholder="请输入备注内容"
            rows="6"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
