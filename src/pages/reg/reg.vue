<template>
  <view class="content">
    <view class="input-group">
      <view class="input-row border">
        <text class="title">账号：</text>
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="username"
          placeholder="请输入受邀人账号"
        ></m-input>
      </view>
      <view class="input-row border">
        <text class="title">密码：</text>
        <m-input
          type="password"
          displayable
          v-model="password"
          placeholder="请输入受邀人密码"
        ></m-input>
      </view>
      <view class="input-row border">
        <text class="title">邮箱：</text>
        <m-input
          type="email"
          v-model="email"
          placeholder="请输入受邀人邮箱"
        ></m-input>
      </view>
    </view>
    <view class="btn-row">
      <button
        type="primary"
        class="primary"
        :loading="confirmBtnLoading"
        @tap="open"
      >
        邀请
      </button>
    </view>
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        type="input"
        title="确认"
        content="是否确认邀请？"
        :before-close="true"
        @close="close"
        @confirm="confirm"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import jsencrypt from '@/components/jsencrypt/jsencrypt.vue';

import mInput from "../../components/m-input.vue";
import { uniPopupDialog } from "@dcloudio/uni-ui";
export default {
  components: {
    mInput,
    uniPopupDialog,
  },
  data() {
    return {
      username: "",
      password: "",
      email: "",
      confirmBtnLoading: false,
    };
  },
  methods: {
    checkIsValid() {
      // TODO 检测学号格式
      if (this.username.length != 8) {
        uni.showToast({
          icon: "none",
          title: "账号格式有误",
        });
        return false;
      }
      if (this.password.length < 6) {
        uni.showToast({
          icon: "none",
          title: "密码最短为 6 个字符",
        });
        return false;
      }
      if (this.email.length < 3 || !~this.email.indexOf("@")) {
        uni.showToast({
          icon: "none",
          title: "邮箱地址不合法",
        });
        return false;
      }
      return true
    },
    open() {
      // 检查输入是否合法
      let isvalid = this.checkIsValid();
      if (!isvalid) {
        return
      }
      // 打开弹出框
      this.$refs.popup.open();
    },
    confirm() {
      this.$refs.popup.close();
      this.confirmBtnLoading = true;
      this.register();
    },
    close(done) {
      // 关闭弹出框
      this.$refs.popup.close();
      this.confirmBtnLoading = false;
    },
    register() {
      let _self = this
      this.$request({
        method: "GET",
        url: "/register/",
        data: {
          username: this.username,
          // password: this.password,
					password: jsencrypt.setEncrypt(uni.getStorageSync('publicKey'), this.password),
          email: this.email,
        },
        success(e) {
          console.log("注册", e);
          let res = e.data;
          if (res.code === 0) {
            uni.showToast({
              title: "注册成功",
            });
          } else {
 				     this.$errorCode(res.code, res.msg)
          }
        },
        fail(e) {
          uni.showModal({
            content: e.data.msg,
            showCancel: false,
          });
        },
        complete(e) {
          console.log("complete", _self.confirmBtnLoading);
          _self.confirmBtnLoading = false;
        },
      });
    },
  },
};
</script>

<style>
.ul {
  font-size: 15px;
  color: #8f8f94;
  margin-top: 25px;
}

.ul > view {
  line-height: 25px;
}
</style>
