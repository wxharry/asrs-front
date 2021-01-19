import baseURL from "@/common/config.js"
import store from "@/store";
export const request = (options) => {
    uni.request({
        method: options.method,
        url: baseURL + options.url,
        // #ifdef MP-WEIXIN
        header: { 'Cookie': 'sessionid=' + uni.getStorageSync('uni_id_token') },
        // #endif
        data: options.data,//如需其他配置可在此添加或先转换options.url，然后 ...options
        success: options.success,
        fail: options.fail,
        complete: options.complete
    })
}
export const requestErrorCode = (code, msg) => {
    // console.log("in request.js");
    switch (code) {
        case 0:
            break;
        case -5:
            if (process.env.VUE_APP_PLATFORM === 'mp-weixin') {
                launch_url = "../wxAuth/wxAuth"
            } else {
                launch_url = "../login/login"
            }
            if (store.forcedLogin) {
                uni.reLaunch({
                    url: launch_url,
                });
            } else {
                uni.navigateTo({
                    url: launch_url,
                });
            }
            break;
        default:
            uni.showModal({
                content: msg,
                showCancel: false,
              });
            break;
    }
}
