<template>
  <view>
    <view class="center">
      <view class="center-list">
        <view
          class="center-list-item border-bottom"
          @tap="gotoUpdate('password')"
        >
          <text class="list-icon">学号</text>
          <text class="list-text">{{ username }}</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
        <view class="center-list-item" @tap="gotoUpdate('email')">
          <text class="list-icon">邮箱</text>
          <text class="list-text">{{ email }}</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mInput from "../../components/m-input.vue";
export default {
  components: {
    mInput,
  },
  data() {
    return {
      username: "",
      password: "",
      email: "",
      seen: false,
    };
  },
  onShow() {
    this.$request({
      method: "GET",
      url: "/getUserInfo/",
      success: (e) => {
        // console.log("successfully get userinfo", e);
        let res = e.data;
        if (res.code === 0) {
          // console.log(res);
          this.username = res.username;
          this.email = res.email;
        } else {
          this.$errorCode(res.code, res.msg);
        }
      },
      fail: (e) => {},
    });
  },
  methods: {
    changeSeen() {
      console.log("seen", this.seen);
      this.seen = !this.seen;
    },
    gotoUpdate(page) {
      // console.log(page);
      uni.navigateTo({
        url: "/pages/info/update-" + page,
      });
    },
  },
};
</script>
<style>
.flex-item {
  width: 33.3%;
  height: 200rpx;
  text-align: center;
  line-height: 200rpx;
}

.flex-item-V {
  width: 100%;
  height: 150rpx;
  text-align: center;
  line-height: 150rpx;
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
view {
  display: flex;
}

page {
  background-color: #f8f8f8;
}

button {
  width: 100%;
}

.center {
  flex-direction: column;
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

.center-list {
  background-color: #ffffff;
  margin-top: 20rpx;
  width: 750rpx;
  flex-direction: column;
}

.center-list-item {
  height: 90rpx;
  width: 750rpx;
  box-sizing: border-box;
  flex-direction: row;
  padding: 0rpx 20rpx;
}

.border-bottom {
  border-bottom-width: 1rpx;
  border-color: #c8c7cc;
  border-bottom-style: solid;
}

.list-icon {
  width: 80rpx;
  height: 90rpx;
  line-height: 90rpx;
  color: #0faeff;
  text-align: center;
  font-family: texticons;
  margin-right: 20rpx;
}

.list-text {
  height: 90rpx;
  line-height: 90rpx;
  color: #555;
  flex: 1;
  text-align: left;
}

.navigat-arrow {
  height: 90rpx;
  width: 40rpx;
  line-height: 90rpx;
  color: #555;
  text-align: right;
  font-family: texticons;
}
</style>