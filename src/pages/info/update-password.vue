<template>
  <view class="center">
    <view class="center-list">
      <view class="input-row border">
        <text class="title">账号：</text>
        <m-input
          type="username"
          v-model="username"
          placeholder="请输入当前用户账号"
        ></m-input>
      </view>
      <view class="input-row">
        <text class="title">新密码：</text>
        <m-input
          type="password"
          v-model="password"
          placeholder="请输入新密码"
        ></m-input>
      </view>
    </view>
    <view class="btn-row">
      <button type="primary" class="primary" :loading="BtnLoading" @tap="open">
        修改信息
      </button>
    </view>
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        type="input"
        title="确认"
        content="是否确认修改信息？"
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
import baseURL from "@/common/config.js";
export default {
  components: {
    mInput,
    uniPopupDialog,
  },
  data() {
    return {
      BtnLoading: false,
      username: "",
      password: "",
    };
  },
  methods: {
    open() {
      let old_username = uni.getStorageSync("username");
      // console.log("old_username", old_username);
      if (this.username.length != 8) {
        uni.showToast({
          icon: "none",
          title: "账号格式有误",
        });
        return;
      }
      if (this.username != old_username) {
        uni.showToast({
          icon: "none",
          title: "请输入当前登录的账号！",
        });
        return;
      }
      if (this.password.length < 6) {
        uni.showToast({
          icon: "none",
          title: "密码最短为 6 个字符",
        });
        return;
      }
      // this.BtnLoading = true;
      // 打开弹出框
      this.$refs.popup.open();
    },
    close(done) {
      // 关闭弹出框
      this.$refs.popup.close();
      this.BtnLoading = false;
    },
    confirm(done, value) {
      let _self = this;
      // 输入框的值
      // console.log(value);
      // console.log("confirm");
      //   操作
      this.$refs.popup.close();
      this.BtnLoading = true;
      // console.log("password", this.password);
      this.$request({
        method: "GET",
        url: "/updateUserInfo/",
        data: {
          // password: this.password,
					password: jsencrypt.setEncrypt(uni.getStorageSync('publicKey'), this.password)
        },
        success: (e) => {
          // console.log(e);
          let res = e.data;
          if (res.code === 0) {
            console.log(res);
            uni.showToast({
              icon: "none",
              title: "修改成功",
            });
          } else {
            console.log(res);
            uni.showModal({
              content: res.msg,
              showCancel: false,
            });
          }
        },
        fail: (e) => {
          uni.showModal({
            content: e.data.msg,
            showCancel: false,
          });
        },
        complete(e) {
          console.log("complete", _self.BtnLoading);
          _self.BtnLoading = false;
        },
      });
    },
    findPassword() {
      if (this.email.length < 3 || !~this.email.indexOf("@")) {
        uni.showToast({
          icon: "none",
          title: "邮箱地址不合法",
        });
        return;
      }
      uni.showToast({
        icon: "none",
        title: "已发送确认邮件至注册邮箱，请注意查收。",
        duration: 3000,
      });
    },
  },
};
</script>
<style>
.center {
  flex-direction: column;
}
.center-list {
  background-color: #ffffff;
  margin-top: 20rpx;
  width: 750rpx;
  flex-direction: column;
}

.text {
  margin: 15rpx 10rpx;
  padding: 0 20rpx;
  background-color: #fafafa;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  color: #777;
  font-size: 26rpx;
}

.flex-pc {
  display: flex;
  justify-content: center;
}
page {
  background-color: #f8f8f8;
}
</style>