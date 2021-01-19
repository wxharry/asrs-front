<template>
  <view class="content">
    <view class="input-row">
      <text class="title">邮箱：</text>
      <m-input type="email" v-model="email" placeholder="请输入邮箱"></m-input>
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
      email: "",
    };
  },
  methods: {
    open() {
      this.BtnLoading = true;
      // 打开弹出框
      this.$refs.popup.open();
    },
    close(done) {
      // 关闭弹出框
      this.$refs.popup.close();
      this.BtnLoading = false;
    },
    confirm(done, value) {
      // 输入框的值
      console.log(value);
      console.log("confirm");
      //   操作
      
      this.$refs.popup.close();
      if (this.email.length < 3 || !~this.email.indexOf("@")) {
        uni.showToast({
          icon: "none",
          title: "邮箱地址不合法",
        });
      this.BtnLoading = false;
        return;
      }
      uni.request({
        method: "GET",
        url: baseURL + "/updateUserInfo/",
        data: {
          email: this.email,
        },
        success: (e) => {
          console.log(e);
          let res = e.data;
          if (res.code === 0) {
            console.log(res);
            uni.showToast({
              icon: "none",
              title: "修改成功",
            });
          } else {
            this.$errorCode(res.code, res.msg)
          }
        },
        fail: (e) => {
          uni.showModal({
            content: e.data.msg,
            showCancel: false,
          });
        },
      });
      this.BtnLoading = false;
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
</style>