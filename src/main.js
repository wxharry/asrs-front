import Vue from 'vue'
import App from './App'

import store from './store'
import {request, requestErrorCode} from "@/common/request.js";

Vue.config.productionTip = false

Vue.prototype.$store = store

Vue.prototype.$request = request
Vue.prototype.$errorCode = requestErrorCode

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
