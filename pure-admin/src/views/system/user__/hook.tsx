import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  UserQuery,
  getUserListApi,
  addUserApi,
  updateUserStatusApi,
  updateUserApi,
  exportUserExcelApi,
  UserRequest,
  deleteUserApi,
  PasswordRequest,
  updateUserPasswordApi
} from "@/api/system/user";
import editForm from "./form.vue";
import passwordForm from "./passwordForm.vue";
import uploadForm from "./uploadForm.vue";
import { ElMessageBox } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, toRaw, h } from "vue";
import { CommonUtils } from "@/utils/common";
import { addDialog } from "@/components/ReDialog";
import { handleTree, setDisabledForTreeOptions } from "@/utils/tree";
import { getDeptListApi } from "@/api/system/dept";
import { getPostListApi } from "@/api/system/post";
import { getAllRoleApi } from "@/api/system/role";

export function useHook() {
  const searchFormParams = reactive<UserQuery>({
    //deptId: null,
    phone_number: undefined,
    status: undefined,
    username: undefined,
    time_range_column: "createTime"
  });

  const formRef = ref();
  const timeRange = ref<[string, string]>();

  const dataList = ref([]);
  const pageLoading = ref(true);
  const switchLoadMap = ref({});
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const deptTreeList = ref([]);
  const postOptions = ref([]);
  const roleOptions = ref([]);

  const columns: TableColumnList = [
    {
      label: "Id",
      prop: "id",
      width: 130,
      fixed: "left"
    },
    {
      label: "用户名",
      prop: "username",
      minWidth: 130
    },
    {
      label: "昵称",
      prop: "nickname",
      minWidth: 130
    },
    {
      label: "性别",
      prop: "gender",
      minWidth: 90,
      cellRenderer: ({ row, props }) => {
        let gender_desc = "未知";
        let style = "info"
        if (row.gender === "MALE") {
          gender_desc = "男";
          style = "";
        } else if (row.gender == "FEMALE") {
          gender_desc = "女";
          style = "danger";
        }
        return (
          <el-tag
            size={props.size}
            type={style}
            effect="plain"
          >
            {gender_desc}
          </el-tag>
        )
      }
    },
    // {
    //   label: "部门ID",
    //   prop: "deptId",
    //   minWidth: 130,
    //   hide: true
    // },
    // {
    //   label: "部门",
    //   prop: "deptName",
    //   minWidth: 130,
    //   hide: true
    // },
    {
      label: "手机号码",
      prop: "phone_number",
      minWidth: 90
    },
    // {
    //   label: "角色ID",
    //   prop: "role_id",
    //   minWidth: 90,
    //   hide: true
    // },
    // {
    //   label: "角色",
    //   prop: "role_name",
    //   minWidth: 90
    // },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={"ENABLED"}
          inactive-value={"DISABLED"}
          active-text="正常"
          inactive-text="停用"
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 70,
      prop: "create_time",
      formatter: ({ create_time }) =>
        dayjs(create_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${row.status === "DISABLED" ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${row.username
      }</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        switchLoading(index, true);
        await updateUserStatusApi(row.id, row.status).finally(() => {
          switchLoading(index, false);
        });
        message("已成功修改用户状态", {
          type: "success"
        });
      })
      .catch(() => {
        message("取消操作", {
          type: "info"
        });
        // 如果取消的话 恢复更改前的状态
        row.status === "DISABLED" ? (row.status = "ENABLED") : (row.status = "DISABLED");
      });
  }

  function switchLoading(index: number, loading: boolean) {
    switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
      loading: loading
    });
  }

  async function exportAllExcel() {
    CommonUtils.fillPaginationParams(searchFormParams, pagination);
    exportUserExcelApi(toRaw(searchFormParams), "用户列表.xls");
  }

  async function handleAdd(row, done) {
    await addUserApi(row as UserRequest).then(() => {
      message(`您新增了用户${row.username}的这条数据`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      getList();
    });
  }

  async function handleUpdate(row, done) {
    await updateUserApi(row.id, row as UserRequest).then(() => {
      message(`您修改了用户${row.username}的这条数据`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      getList();
    });
  }

  async function handleDelete(row) {
    await deleteUserApi(row.id).then(() => {
      message(`您删除了用户${row.username}的这条数据`, { type: "success" });
      // 刷新列表
      getList();
    });
  }

  async function handleResetPassword(row, request, done) {
    await updateUserPasswordApi(request).then(() => {
      message(`您修改了用户${row.username}的密码`, { type: "success" });
      // 刷新列表
      done();
      getList();
    });
  }

  async function onSearch() {
    // 点击搜索的时候 需要重置分页
    pagination.currentPage = 1;
    getList();
  }

  async function openDialog(title = "新增", row?: UserRequest) {
    // TODO 如果是编辑的话  通过获取用户详情接口来获取数据
    addDialog({
      title: `${title}管理员`,
      props: {
        formInline: {
          id: row?.id ?? 0,
          username: row?.username ?? "",
          nickname: row?.nickname ?? "",
          //deptId: row?.deptId ?? undefined,
          phone_number: row?.phone_number ?? "",
          email: row?.email ?? "",
          password: title == "新增" ? "" : undefined,
          gender: row?.gender ?? undefined,
          status: row?.status ?? undefined,
          //postId: row?.postId ?? undefined,
          role_ids: row?.role_ids ?? undefined,
          remark: row?.remark ?? ""
        },
        deptOptions: deptTreeList,
        postOptions: postOptions,
        roleOptions: roleOptions
      },

      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const formRuleRef = formRef.value.getFormRuleRef();
        const curData = options.props.formInline as UserRequest;

        formRuleRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              handleAdd(curData, done);
            } else {
              handleUpdate(curData, done);
            }
          }
        });
      }
    });
  }

  async function openResetPasswordDialog(row) {
    const passwordFormRef = ref();
    addDialog({
      title: `重置密码`,
      props: {
        formInline: {
          id: row.id ?? 0,
          password: ""
        }
      },
      width: "30%",
      closeOnClickModal: false,
      contentRenderer: () => h(passwordForm, { ref: passwordFormRef }),
      beforeSure: (done, { options }) => {
        const formRef = passwordFormRef.value.getFormRuleRef();
        const curData = options.props.formInline as PasswordRequest;

        formRef.validate(valid => {
          if (valid) {
            handleResetPassword(row, curData, done);
          }
        });
      }
    });
  }

  async function openUploadDialog() {
    const uploadFormRef = ref();
    addDialog({
      title: `导入用户`,
      props: {},
      width: "30%",
      closeOnClickModal: false,
      contentRenderer: () => h(uploadForm, { ref: uploadFormRef }),
      beforeSure: done => {
        console.log("上传文件");
        uploadFormRef.value.getFormRef().submit();
        done();
        getList();
      }
    });
  }

  async function getList() {
    CommonUtils.fillPaginationParams(searchFormParams, pagination);
    CommonUtils.fillTimeRangeParams(searchFormParams, timeRange.value);

    pageLoading.value = true;
    const { data } = await getUserListApi(toRaw(searchFormParams)).finally(
      () => {
        pageLoading.value = false;
      }
    );

    dataList.value = data.rows;
    pagination.total = data.total;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(async () => {
    onSearch();
    // const deptResponse = await getDeptListApi();
    // deptTreeList.value = await setDisabledForTreeOptions(
    //   handleTree(deptResponse.data),
    //   "status"
    // );

    // const postResponse = await getPostListApi({});
    // postOptions.value = postResponse.data.rows;

    const roleResponse = await getAllRoleApi();
    roleOptions.value = roleResponse.data;
  });

  return {
    searchFormParams,
    pageLoading,
    columns,
    dataList,
    pagination,
    buttonClass,
    onSearch,
    openDialog,
    exportAllExcel,
    resetForm,
    handleUpdate,
    getList,
    handleDelete,
    openResetPasswordDialog,
    openUploadDialog
  };
}
