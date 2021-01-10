<template>
  <view class="content">
    <view v-if="hasLogin" class="hello">
      <view class="uni-list-cell uni-list-cell-pd">
        <view class="uni-list-cell-db" style="color: #8f8f94">{{
          open ? "开启中" : "已关闭"
        }}</view>
        <switch
          :checked="open"
          color="#FFCC33"
          style="transform: scale(0.7)"
          @change="switch1Change"
        />
      </view>
      <view class="title"> 您好 {{ userName }}，您已成功登录。 </view>
      <view class="ul">
        <view>这是首页，作为填报模板展示区域</view>


        <view v-for="(item, i) in modelList" :key="item.id">
          <view :id="item.id" :hidden="item.hidden">
            <label>{{ item.title === undefined ? "" : item.title }}</label>
            <component
              v-model="item.val"
              :is="item.newType"
              v-bind="item.prop"
              @change="item.change"
            ></component>
          </view>
        </view>
        <button @tap="submit">提交</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { univerifyLogin } from "@/common/univerify.js";
import { UniDataCheckbox, UniNoticeBar } from "@dcloudio/uni-ui";
import { convertModel } from "@/common/modelProcess.js";
import MInput from "../../components/m-input.vue";
import biaofunDatetimePicker from "@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue";
import biaofunRegion from "@/components/biaofun-region/biaofun-region.vue";
export default {
  computed: mapState(["forcedLogin", "hasLogin", "userName"]),
  components: {
    UniDataCheckbox,
    UniNoticeBar,
    MInput,
    biaofunDatetimePicker,
    biaofunRegion,
  },
  data() {
    return {
      open: true,
      value: "",
      bushi: "123",
      modelList: [],
    };
  },
  onLoad() {
    const loginType = uni.getStorageSync("login_type");
    if (loginType === "local") {
      this.login(uni.getStorageSync("username"));
      return;
    }
    let uniIdToken = uni.getStorageSync("uni_id_token");
    if (uniIdToken) {
      this.login(uni.getStorageSync("username"));
      this.$request({
        method: "GET",
        url: "/getModel/",
        success: (e) => {
          console.log("success", e);
          var res = e.data;
          if (res.code === 0) {
            console.log(res);
            this.open = res.is_auto_flag;
            this.modelList = convertModel(res.model);
            console.log("ml", this.modelList);
          } else if (res.code === -5) {
            //token过期或token不合法，重新登录
            if (this.forcedLogin) {
              uni.reLaunch({
                url: "../login/login",
              });
            } else {
              uni.navigateTo({
                url: "../login/login",
              });
            }
          }
        },
      });
      // uniCloud.callFunction({
      //   name: "user-center",
      //   data: {
      //     action: "checkToken",
      //   },
      //   success: (e) => {
      //     console.log("checkToken success", e);

      //   if (e.result.code > 0) {
      //     //token过期或token不合法，重新登录
      //     if (this.forcedLogin) {
      //       uni.reLaunch({
      //         url: "../login/login",
      //       });
      //     } else {
      //       uni.navigateTo({
      //         url: "../login/login",
      //       });
      //     }
      //   }
      // },
      //   fail(e) {
      //     uni.showModal({
      //       content: JSON.stringify(e),
      //       showCancel: false,
      //     });
      //   },
      // });
    } else {
      this.guideToLogin();
    }
  },
  methods: {
    ...mapMutations(["login"]),
    submit() {
      console.log("submit", this.modelList);
      var model = []
      for (let i = 0; i < this.modelList.length; i++) {
        model.push({
          "id":this.modelList[i].id,
          "name": this.modelList[i].name,
          "type": this.modelList[i].type,
          "val": this.modelList[i].val
        })
      }
      this.$request({
        url: "/setPersonalModel/",
        methods: "GET",
        data: {"model":JSON.stringify(model)},
        success: (e) => {
          console.log("success", e);
          var res = e.data;
          if (res.code === 0) {
            console.log(res);
          } else if (res.code === -5) {
            //token过期或token不合法，重新登录
            if (this.forcedLogin) {
              uni.reLaunch({
                url: "../login/login",
              });
            } else {
              uni.navigateTo({
                url: "../login/login",
              });
            }
          }
        },
      });
    },
    changeDatetimePicker(e) {
      console.log("e", e);
    },
    change() {
      console.log("change");
    },
    guideToLogin() {
      uni.showModal({
        title: "未登录",
        content: "您未登录，需要登录后才能继续",
        /**
         * 如果需要强制登录，不显示取消按钮
         */
        showCancel: !this.forcedLogin,
        success: (res) => {
          if (res.confirm) {
            univerifyLogin().catch((err) => {
              if (err === false) return;
              /**
               * 如果需要强制登录，使用reLaunch方式
               */
              if (this.forcedLogin) {
                uni.reLaunch({
                  url: "../login/login",
                });
              } else {
                uni.navigateTo({
                  url: "../login/login",
                });
              }
            });
          }
        },
      });
    },
    switch1Change: function (e) {
      this.open = e.detail.value;
      let token = uni.getStorageSync("uni_id_token");
      console.log("token", token);
      // console.log("switch1 发生 change 事件，携带值为", e.detail.value);
      this.$request({
        method: "GET",
        url: "/isAutoReport/",
        data: {
          is_auto_flag: this.open ? 1 : 0,
        },
        success: (e) => {
          console.log("success", e);
          if (e.data.code === -5) {
            if (this.forcedLogin) {
              uni.reLaunch({
                url: "../login/login",
              });
            } else {
              uni.navigateTo({
                url: "../login/login",
              });
            }
          }
        },
      });
    },
  },
};
</script>

<style>
.hello {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.title {
  color: #8f8f94;
  margin-top: 25px;
}

.ul {
  font-size: 15px;
  color: #8f8f94;
  margin-top: 25px;
}

.ul > view {
  line-height: 25px;
}
</style>
