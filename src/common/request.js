import baseURL from "@/common/config.js"

const request = (options) => {
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
export default request