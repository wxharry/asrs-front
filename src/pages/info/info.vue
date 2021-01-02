<template>
  <view class="content">
    <view class="input-group">
      <view class="uni-flex uni-row">
        <view class="text" style="width: 150rpx">学号</view>
        <view class="text" style="-webkit-flex: 1; flex: 1">{{
          username
        }}</view>
      </view>
      <view class="uni-flex uni-row">
        <view class="text" style="width: 150rpx">密码</view>
        <view class="text" style="-webkit-flex: 1; flex: 1">{{
          password
        }}</view>
      </view>
      <view class="uni-flex uni-row">
        <view class="text" style="width: 150rpx">邮箱</view>
        <view class="text" style="-webkit-flex: 1; flex: 1">{{ email }}</view>
      </view>
    </view>
    <view class="btn-row">
      <button type="primary" class="primary" @tap="updateInfo">修改信息</button>
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
    };
  },
  methods: {
    findPassword() {
      /**
       * 仅做示例
       */
      if (this.email.length < 3 || !~this.email.indexOf("@")) {
        uni.showToast({
          icon: "none",
          title: "邮箱地址不合法",
        });
        return;
      }
      uni.showToast({
        icon: "none",
        title: "已发送重置邮件至注册邮箱，请注意查收。",
        duration: 3000,
      });
    },
    updateInfo() {
      uni.navigateTo({
        url: "/pages/info/update-info",
      });
    }
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

.desc {
  /* text-indent: 40rpx; */
}
.flex-pc {
  display: flex;
  justify-content: center;
}
</style>