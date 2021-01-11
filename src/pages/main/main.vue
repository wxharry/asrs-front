<template>
  <view class="">
    <view class="center">
      <view class="center-list">
        <view class="uni-list-cell uni-list-cell-pd">
          <view class="uni-list-cell-db" style="color: #8f8f94">自动填报</view>
          <switch
            :checked="auto"
            color="#FFCC33"
            style="transform: scale(0.7)"
            @change="switchChangeAuto"
          />
        </view>

        <view class="uni-list-cell uni-list-cell-pd">
          <view class="uni-list-cell-db" style="color: #8f8f94"
            >允许使用默认模板</view
          >
          <switch
            :checked="defaultModel"
            color="#FFCC33"
            style="transform: scale(0.7)"
            @change="switchChangeDefault"
          />
        </view>
      </view>

      <view class="center-list">
        <view class="uni-list-cell uni-list-cell-pd">
          <text class="title">当前地区</text>
          <biaofunRegion
            @change="changeRegin"
            :defaultValue="region"
          ></biaofunRegion>
        </view>
        <view class="input-row border">
          <text class="title">具体地址</text>
          <m-input v-model="address" placeholder="具体地址"></m-input>
        </view>
        <view class="input-row border">
          <text class="title">体温</text>
          <m-input v-model="temperature" placeholder="请输入体温"></m-input>
        </view>
      </view>

      <uni-collapse @change="change" accordion="true" showAnimation="true">
        <uni-collapse-item title="展开填报模板">
          <view class="ul">
            <view v-for="item in modelList" :key="item.id">
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
          </view>
        </uni-collapse-item>
      </uni-collapse>
      <view class="btn-row">
        <button type="primary" class="primary" @tap="submit">提交</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { univerifyLogin } from "@/common/univerify.js";
import {
  UniDataCheckbox,
  UniNoticeBar,
  uniCollapse,
  uniCollapseItem,
} from "@dcloudio/uni-ui";
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
    uniCollapse,
    uniCollapseItem,
  },
  data() {
    return {
      auto: true,
      defaultModel: true,
      value: "",
      modelList: [],
      region: [],
      address: "",
      temperature: "",
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
        url: "/getUserInfo/",
        methods: "GET",
        success: (e) => {
          console.log("success info", e);
          var res = e.data;
          if (res.code === 0) {
            // console.log(res);
            this.region.push(res.sheng);
            this.region.push(res.shi);
            this.region.push(res.xian);
            this.address = res.address;
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
      this.$request({
        method: "GET",
        url: "/getModel/",
        success: (e) => {
          console.log("success", e);
          var res = e.data;
          if (res.code === 0) {
            console.log(res);
            this.open = res.is_auto_flag;
            var _self = this;
            this.modelList = convertModel(res.model, _self);
            // console.log("ml", this.modelList);
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
      var model = [];
      for (let i = 0; i < this.modelList.length; i++) {
        model.push({
          id: this.modelList[i].id,
          name: this.modelList[i].name,
          type: this.modelList[i].type,
          val: this.modelList[i].val,
          hidden: this.modelList[i].hidden,
        });
      }
      const data = {
        model: JSON.stringify(model),
        location: {
          sheng: this.region[0],
          shi: this.region[1],
          xian: this.region[2],
          address: this.address,
        },
      };
      console.log("submit", data);
      this.$request({
        url: "/setPersonalModel/",
        methods: "GET",
        data: data,
        success: (e) => {
          console.log("success", e);
          var res = e.data;
          if (res.code === 0) {
            // console.log(res);
            this.sheng = res.sheng;
            this.shi = res.shi;
            this.xian = res.xian;
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
    changeRegin(e) {
      console.log("changeR", e);
      this.region[0] = e[0].name;
      this.region[1] = e[1].name;
      this.region[2] = e[2].name;
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
    switchChangeAuto: function (e) {
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
    switchChangeDefault: function (e) {
      this.open = e.detail.value;
      let token = uni.getStorageSync("uni_id_token");
      console.log("token", token);
      // console.log("switch1 发生 change 事件，携带值为", e.detail.value);
      // this.$request({
      //   method: "GET",
      //   url: "/UseDefaultModelFlag/", //是否使用默认模板
      //   data: {
      //     is_auto_flag: this.defaultModel ? 1 : 0,
      //   },
      //   success: (e) => {
      //     console.log("success", e);
      //     if (e.data.code === -5) {
      //       if (this.forcedLogin) {
      //         uni.reLaunch({
      //           url: "../login/login",
      //         });
      //       } else {
      //         uni.navigateTo({
      //           url: "../login/login",
      //         });
      //       }
      //     }
      //   },
      // });
    },
  },
};
</script>

<style>

page {
  background-color: #f8f8f8;
}
.hello {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.title {
  color: #8f8f94;
  /* margin-top: 25px; */
}

.ul {
  font-size: 15px;
  color: white;
  margin: 20px;
}

.ul > view {
  line-height: 25px;
}
</style>
