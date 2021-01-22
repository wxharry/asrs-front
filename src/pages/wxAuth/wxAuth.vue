<template>
  <view class="content">
    <view class="center">
      <view class="avatar">
        <image src="../../static/img/avatar.jpeg"></image>
      </view>
      <view class="title">欢迎使用<br />SHU自动填报系统</view>
      <view class="text">点击图标授权登录</view>
    </view>
    <view class="oauth-row">
      <view class="oauth-image">
        <image src="../../static/img/weixin.png"></image>
        <button open-type="getUserInfo" @getuserinfo="wxLogin"></button>
      </view>
    </view>
  </view>
</template>
​
<script>
// import { mapMutation } from 'vuex';​
export default {
  data() {
    return {
      logining: false,
    };
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    // 判断微信小程序是否已经授权
    uni.getSetting({
      success(res) {
        console.log("是否授权？ ", res);
        if (!res.authSetting["scope.userInfo"]) {
          console.log("未授权, 停留在此页进行授权操作。");
        } else {
          console.log("已授权，刷新session信息保持登录状态。");
          // 还没写
          uni.login({
            provider: "weixin",
            success: (login_res) => {
              let code = login_res.code;
              console.log("code: ", code);
              uni.getUserInfo({
                success(info_res) {
                  console.log(info_res);
                  uni.request({
                    url: "https://www.liaoluoxing.cn:444/wxlogin/",
                    method: "GET",
                    data: {
                      code: code,
                      rawData: info_res.rawData,
                    },
                    success(res) {
                      console.log("GET刷新session", res.data);
                      uni.setStorageSync("uni_id_token", res.data.sessionId);
                      uni.setStorageSync("publicKey", res.data.rsa_public_key);
                      // 温馨提示：uni.navigateTo只能用于非tabbar页面的跳转
                      uni.reLaunch({
                        url: "../main/main",
                      });
                    },
                    fail(error) {
                      console.log(error);
                    },
                  });
                },
              });
            },
          });
        }
      },
    });
    // #endif
  },
  methods: {
    wxLogin(e) {
      const that = this;
      that.logining = true;
      let userInfo = e.detail.userInfo;
      uni.login({
        provider: "weixin",
        success: (login_res) => {
          let code = login_res.code;
          console.log("code: ", code);
          uni.getUserInfo({
            success(info_res) {
              console.log(info_res);
              uni.request({
                url: "https://www.liaoluoxing.cn:444/wxlogin/",
                method: "GET",
                // header: {
                // 	'content-type': 'application/x-www-form-urlencoded'
                // },
                data: {
                  code: code,
                  rawData: info_res.rawData,
                },
                success(res) {
                  console.log("200: ", res.data);
                  uni.setStorageSync("uni_id_token", res.data.sessionId);
                  uni.setStorageSync("publicKey", res.data.rsa_public_key);
                  uni.navigateTo({
                    url: "../login/login",
                  });
                },
                fail(error) {
                  console.log(error);
                },
              });
              uni.hideLoading();
              // uni.navigateBack()
            },
          });
        },
      });
    },
  },
};
</script>
​
<style lang="scss">
.oauth-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  left: 0;
  width: 100%;
}

.oauth-image {
  position: relative;
  width: 50px;
  height: 50px;
  border: 1px solid #dddddd;
  border-radius: 50px;
  margin: 0 20px;
  background-color: #ffffff;
}

.oauth-image image {
  width: 30px;
  height: 30px;
  margin: 10px;
}

.oauth-image button {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.title {
  color: #38383a;
  margin-top: 40px;
  font-size: 25px;
  text-align: center;
}
.text {
  text-align: center;
  color: #5f5f5f;
  margin-top: 10px;
  font-size: 15px;
}

.avatar {
  margin-top: 70px;
  widows: 100%;
  text-align: center;
}
.avatar image {
  width: 70px;
  height: 70px;
  border-radius: 50px;
}
</style>
​
