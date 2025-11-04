import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isPhone, isEmail } from "@pureadmin/utils";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  //name: [{ required: true, message: "部门名称为必填项", trigger: "blur" }],
  username: [
    {
      required: true,
      message: "用户名不能为空"
    }
  ],
  nickname: [
    {
      required: true,
      message: "昵称不能为空"
    }
  ],
  role_ids: [
    {
      required: true,
      message: "角色不能为空"
    }
  ],
  status: [
    {
      required: true,
      message: "状态不能为空"
    }
  ],
  phone_number: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号码格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
      // trigger: "click" // 如果想在点击确定按钮时触发这个校验，trigger 设置成 click 即可
    }
  ],
  email: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isEmail(value)) {
          callback(new Error("请输入正确的邮箱格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});
