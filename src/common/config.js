let url_config = ""

if(process.env.NODE_ENV === 'development'){
    // 开发环境
    url_config = '/api'
    // url_config = 'https://www.liaoluoxing.cn:444'
}else{
    // 生产环境
    if (process.env.VUE_APP_PLATFORM === 'mp-weixin') {
        url_config = 'https://www.liaoluoxing.cn:444'
    }else{
        url_config = '/api'
    }
    
}

export default url_config