<template>
	<view class="container">
		<view class="left-top-sign">LOGIN</view>
		<view class="welcome">欢迎回来！</view>
		<button class="confirm-btn" open-type="getUserInfo" @getuserinfo="wxLogin" :disabled="logining">微信授权登录</button>
	</view>
</template>
​
<script>
	// import { mapMutation } from 'vuex';​
	export default {
		data() {
			return {
				logining: false
			};
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			// 判断微信小程序是否已经授权
			uni.getSetting({
				success(res) {
					console.log('授权: ', res)
					if (!res.authSetting['scope.userInfo']) {
						console.log('未授权, 停留在此页进行授权操作。')
					} else {
						console.log('已授权，刷新session信息保持登录状态。')
						
						uni.reLaunch({
							url: '../main/main'
						})
					}
				}
			})
			// #endif
		},
		methods: {
			wxLogin(e) {
				const that = this;
				that.logining = true;
				let userInfo = e.detail.userInfo;
				uni.login({
					provider: "weixin",
					success: (login_res => {
						let code = login_res.code;
						console.log("code: ", code)
						uni.getUserInfo({
							success(info_res) {
								console.log(info_res)
								uni.request({
									url: 'https://www.liaoluoxing.cn:444/wxlogin/',
									method: "GET",
									// header: {
									// 	'content-type': 'application/x-www-form-urlencoded'
									// },
									data: {
										code: code,
										rawData: info_res.rawData
									},
									success(res) {
										// 如果授权成功，跳转到主页，在那里进行账号绑定（和session注入）
										console.log('200: ', res.data)
										uni.setStorageSync('uni_id_token', res.data.sessionId)
										// 温馨提示：uni.navigateTo只能用于非tabbar页面的跳转
										uni.reLaunch({
											url: '../main/main'
										})
										
										
										
									},
									fail(error) {
										console.log(error)
									}
								})
								uni.hideLoading()
								// uni.navigateBack()
							}
						})

					})
				})
			}
		}
	};
</script>
​
<style lang="scss">
	.container {
		display: flex;
		overflow: hidden;
		background: #fff;
		flex-direction: column;
		justify-content: center;

		.left-top-sign {
			font-size: 120upx;
			color: blue($color: #000000);
			position: relative;
			left: -10upx;
			margin-top: 100upx;
		}

		.welcome {
			position: relative;
			left: 50upx;
			top: -90upx;
			font-size: 46upx;
			color: #555;
			text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
		}

		.confirm-btn {
			width: 630upx;
			height: 76upx;
			line-height: 76upx;
			border-radius: 50px;
			margin-top: 70upx;
			background: green($color: #000000);
			color: #fff;
			font-size: 30upx;

			&:after {
				border-radius: 100px;
			}
		}
	}
</style>
​
