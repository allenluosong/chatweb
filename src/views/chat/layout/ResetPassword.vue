<!--
 * @Author: Allenluo
 * @LastEditTime: 2023-10-06 14:29:13
 * @FilePath: \chagpt-shuowen\src\views\chat\layout\ResetPassword.vue
 * @Description:
-->
<script setup lang='ts'>
import { ref } from "vue";
import type { FormInst, FormItemRule, FormRules } from "naive-ui";
import {
  NButton,
  NForm,
  NFormItem,
  NImage,
  NInput,
  useDialog,
  useMessage,
} from "naive-ui";
import { SvgIcon } from "@/components/index";
import { RegisterType, getPicCode, registerEmail } from "@/api/register";
import { resetPassword, resetPasswordEmailCode } from "@/api/index";
import type {
  resetPasswordModel,
  resetPasswordEmailCodeModel,
} from "@/api/index";

const ms = useMessage();
const dialog = useDialog();
const loading = ref(false);
const emailloading = ref(false);

let buttonText = "获取邮箱验证码"; // 初始文本

async function sendEmailVerficationCode() {
  if (userInfo.value.email.length === 0) {
    ms.error("请输入邮箱");
    return;
  }
  // 赋值
  const pushData: resetPasswordEmailCodeModel = {
    to_email_address: userInfo.value.email,
  };
  try {
    // 开启加载状态
    emailloading.value = true;
    // 发起请求
    await resetPasswordEmailCode(pushData);

    // 成功弹框
    dialog.success({
      title: "密码重置邮件发送成功!!!",
      content: `请到${userInfo.value.email}查看邮件确认,验证码有效期10分钟`,
      maskClosable: false,
      closable: false,
      positiveText: "确定",
    });
  } catch (error: any) {
    // 错误弹框
    ms.error(error.message ?? "error");
  } finally {
    // 关闭加载状态
    emailloading.value = false;
  }
}



async function handleReset() {
  // 格式校验
  console.log(formRef.value)
  console.log("userinfo", userInfo.value)
  formRef.value?.validate((errors: any) => {
    if (!errors) pushClick();
    else ms.error("请正确填写输入框中的内容");
  });
}

async function pushClick() {
  // 取值

  const pushData: resetPasswordModel = {
    to_email_address: userInfo.value.email,
    newPassword: userInfo.value.newPassword,
    picCodeSessionId: picData.value.picCodeSessionId,
    picVerificationCode: userInfo.value.captcha,
    emailVerficationCode: userInfo.value.emailVerficationCode,
  };

  try {
    // 开启加载状态
    loading.value = true;
    // 发起请求
    // 注册
    await resetPassword(pushData);

    // 成功弹框
    dialog.success({
      title: "密码重置成功!!!",
      content: `请点击确定返回登录`,
      maskClosable: false,
      closable: false,
      positiveText: "确定",
      onPositiveClick: () => {
        // 重载页面
        window.location.reload();
      },
    });
  } catch (error: any) {
    // 错误弹框
    ms.error(error.message ?? "error");
  } finally {
    // 关闭加载状态
    loading.value = false;
  }
}

// 验证码数据
const picData = ref<getPicCodeType>({
  picCodeBase64: "",
  // 图形验证码会话ID，注册时需要传过来
  picCodeSessionId: "",
});

// 表单相关
const formRef = ref<FormInst | null>(null);
const  userInfo= ref({
  email: "",
  newPassword: "",
  captcha: "",
  emailVerficationCode: "",
});
// 表单校验规则
const rules: FormRules = {
  email: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      // 自定义验证  规则

      // const regMobile = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      const regMobile = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!value) return new Error("请输入邮箱");
      else if (!regMobile.test(value)) return new Error("请输出正确邮箱格式");

      return true;
    },
  },
  newPassword: [
    {
      required: true,
      message: "请输入新的密码",
      trigger: ["input", "blur"],
    },
  ],
  emailVerficationCode: [
    {
      required: true,
      trigger: ["input", "blur"],
      validator(rule, value) {
        // 自定义验证  规则
        const regMobile = /^[a-zA-Z0-9]{6}$/;
        if (!value) return new Error("请输入邮箱验证码");
        else if (!regMobile.test(value)) return new Error("请输入六位数验证码");

        return true;
      },
    },
  ],

  captcha: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        // 自定义验证  规则
        const regMobile = /^[a-zA-Z0-9]{6}$/;
        if (!value) return new Error("请输入验证码");
        else if (!regMobile.test(value)) return new Error("请输入六位的验证码");

        return true;
      },
    },
  ],
};

/**
 * @description: 密码校验规则
 * @param {*} rule
 * @param {*} value
 * @return {*}
 */
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === userInfo.value.passWord;
}

/**
 * @description: 获取验证码数据
 * @return {*}
 */
async function getPicData() {
  try {
    // 开启加载状态
    loading.value = true;
    const { data } = await getPicCode();
    picData.value.picCodeBase64 = `data:image/png;base64,${data?.picCodeBase64}`;
    picData.value.picCodeSessionId = data?.picCodeSessionId;
  } catch (error) {
    ms.error(error.message ?? "error");
    // 关闭加载状态
    loading.value = false;
  } finally {
    // 关闭加载状态
    loading.value = false;
  }
}
getPicData();


/**
 * @description: 监听键盘Enter事件
 * @param {*} event
 */
function handlePress(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleReset();
  }
}
</script>

<template>
  <NForm ref="formRef" :model="userInfo" label-placement="top" :rules="rules">
    <NFormItem path="email" :label="$t('common.email')">
      <NInput v-model:value="userInfo.email" @keypress="handlePress" />
    </NFormItem>
    <NFormItem path="newPassword" :label="$t('common.newPassword')">
      <NInput v-model:value="userInfo.newPassword" @keypress="handlePress" />
    </NFormItem>
    <NFormItem
      path="emailVerficationCode"
      :label="$t('common.emailVerficationCode')"
    >
      <NInput
        v-model:value="userInfo.emailVerficationCode"
        @keypress="handlePress"
      />
      <NButton
        type="primary"
        :loading="emailloading"
        @click="sendEmailVerficationCode"
      >
        {{ buttonText }}
      </NButton>
    </NFormItem>
    <NFormItem path="captcha" :label="$t('common.captcha')">
      <NInput v-model:value="userInfo.captcha" @keypress="handlePress" />
      <div style="width: 200px; height: 34px">
        <NImage :src="picData.picCodeBase64" />
      </div>
      <NButton @click="getPicData">
        <SvgIcon class="text-lg" icon="bi:arrow-clockwise" />
      </NButton>
    </NFormItem>
  </NForm>
  <NButton block type="primary" :loading="loading" @click="handleReset">
    {{ $t("common.reset") }}
  </NButton>
</template>
