<template>
  <view class="">
    <view class="center">
      <view
        class="logo"
        @click="bindLogin"
        :hover-class="!hasLogin ? 'logo-hover' : ''"
      >
        <image class="logo-img" :src="avatarUrl"></image>
        <view class="logo-title">
          <text class="uer-name"
            >Hi，{{ hasLogin ? userName : "您未登录" }}</text
          >
          <text class="go-login navigat-arrow" v-if="!hasLogin">&#xe65e;</text>
        </view>
      </view>
      <view class="center-list">
        <view class="center-list-item border-bottom" @click="goto">
          <text class="list-icon">&#xe60f;</text>
          <text class="list-text">个人信息</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
        <view class="center-list-item" @click="toInvite">
          <text class="list-icon">&#xe65f;</text>
          <text class="list-text">邀请好友</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
      </view>
      <view class="center-list">
        <view class="center-list-item border-bottom">
          <text class="list-icon">&#xe60b;</text>
          <text class="list-text">帮助与反馈</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
        <view class="center-list-item">
          <text class="list-icon">&#xe65f;</text>
          <text class="list-text">服务条款及隐私</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
      </view>
      <view class="center-list">
        <view class="center-list-item">
          <text class="list-icon">&#xe614;</text>
          <text class="list-text">关于应用</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
      </view>
      <view class="btn-row">
        <button
          v-if="hasLogin"
          class="primary"
          type="primary"
          :loading="logoutBtnLoading"
          @tap="bindLogout"
        >
          退出登录
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { univerifyLogin } from "@/common/univerify.js";
export default {
  data() {
    return {
      avatarUrl: "../../static/img/logo.png",
      inviteUrl: "",
      logoutBtnLoading: false,
      hasPwd: uni.getStorageSync("uni_id_has_pwd"),
    };
  },
  computed: {
    ...mapState(["hasLogin", "forcedLogin", "userName"]),
  },

  methods: {
    ...mapMutations(["logout"]),
    bindLogin() {
      if (!this.hasLogin) {
        univerifyLogin().catch((err) => {
          if (err === false) return;

          uni.navigateTo({
            url: "../login/login",
          });
        });
      }
    },
    bindLogout() {
      const loginType = uni.getStorageSync("login_type");
      if (loginType === "local") {
        this.logout();
        if (this.forcedLogin) {
          uni.reLaunch({
            url: "../login/login",
          });
        }
        return;
      }
      this.logoutBtnLoading = true;
      this.$request({
        method: "GET",
        url: "/logout/",
        success: (e) => {
          console.log("logout success", e);
          let res = e.data;
          if (res.code == 0) {
            this.logout();
            uni.removeStorageSync("uni_id_token");
            uni.removeStorageSync("username");
            uni.removeStorageSync("uni_id_has_pwd");
            /**
             * 如果需要强制登录跳转回登录页面
             */
            this.inviteUrl = "";
            if (this.forcedLogin) {
              uni.reLaunch({
                url: "../login/login",
              });
            }
          } else {
            uni.showModal({
              content: "登出失败",
              showCancel: false,
            });
            console.log("登出失败", e);
          }
        },
        fail: (e) => {
          uni.showModal({
            content: JSON.stringify(e),
            showCancel: false,
          });
        },
      });
      this.loginBtnLoading = false;
    },
    toInvite() {
      // console.log("invite");
      uni.navigateTo({
        url: "/pages/reg/reg",
      });
    },
    goto() {
      uni.navigateTo({
        url: "/pages/info/info",
      });
    },
  },
};
</script>

<style>
@font-face {
  font-family: texticons;
  font-weight: normal;
  font-style: normal;
  src: url("https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf")
    format("truetype");
}

page,
view {
  display: flex;
}

page {
  background-color: #f8f8f8;
}

button {
  width: 100%;
}


.logo {
  width: 750rpx;
  height: 240rpx;
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #0faeff;
  flex-direction: row;
  align-items: center;
}

.logo-hover {
  opacity: 0.8;
}

.logo-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 150rpx;
}

.logo-title {
  height: 150rpx;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-left: 20rpx;
}

.uer-name {
  height: 60rpx;
  line-height: 60rpx;
  color: #ffffff;
}

.go-login.navigat-arrow {
  color: #ffffff;
}

.login-title {
  height: 150rpx;
  align-items: self-start;
  justify-content: center;
  flex-direction: column;
  margin-left: 20rpx;
}

</style>
