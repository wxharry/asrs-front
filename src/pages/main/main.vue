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
          <text class="uni-list-cell-db" style="color: #8f8f94">当前地区</text>
          <biaofunRegion
            @change="changeRegin"
            :defaultValue="region"
          ></biaofunRegion>
        </view>
        <view class="uni-list-cell uni-list-cell-pd">
          <text class="uni-list-cell-db" style="color: #8f8f94">具体地址</text>
          <m-input v-model="address" placeholder="具体地址"></m-input>
        </view>
        <!-- <view class="uni-list-cell uni-list-cell-pd">
          <text class="uni-list-cell-db" style="color: #8f8f94">体温</text>
          <m-input v-model="temperature" placeholder="请输入体温"></m-input>
        </view> -->
      </view>
      <view class="center-list" @click="showModel = !showModel">
        <view class="uni-list-cell uni-list-cell-pd">
          <text class="title">{{ showModel ? "折叠" : "展开" }}填报模板</text>
        </view>
      </view>
      <view class="ul" v-if="showModel">
        <view v-for="(item, idx) in modelList" :key="item.id">
          <!-- {{ idx }}{{ item.type }} -->
          <view :id="item.id" :name="item.name" :hidden="item.hidden">
            <view v-if="item.type === 'checkbox'">
              <checkbox-group @change="change($event, idx)">
                <label>
                  <checkbox
                    style="transform: scale(0.75)"
                    :value="'true'"
                    :checked="item.prop.checked"
                  />{{ item.prop.text }}</label
                >
              </checkbox-group>
            </view>

            <view v-if="item.type === 'label'">
              <label>{{ item.text }}</label>
            </view>

            <view v-if="item.type === 'radiobuttonlist'">
              <label>{{ item.title }}</label>
              <radio-group @change="change($event, idx)">
                <label
                  v-for="(option, i) in item.prop.options"
                  :key="option.value"
                >
                  <label>
                    <radio
                      style="transform: scale(0.75)"
                      :value="option.value"
                      :checked="item.val === option.value"
                    />
                    {{ item.prop.options[i].text }}
                  </label>
                </label>
              </radio-group>
            </view>

            <view v-if="item.type === 'datepicker'">
              <label>{{ item.title }}</label>
              <picker
                mode="date"
                fields="day"
                :value="item.val"
                :start="item.prop.start"
                :end="item.prop.end"
                :disabled="item.id === 'p1_BaoSRQ'"
                @change="change($event, idx)"
              >
                <view class="uni-input">{{ item.val }}</view>
              </picker>
            </view>

            <view v-if="item.type === 'checkboxlist'">
              <label>{{ item.title }}</label>
              <checkbox-group @change="change($event, idx)">
                <label v-for="option in item.prop.options" :key="option.value">
                  <label>
                    <checkbox
                      style="transform: scale(0.75)"
                      :value="option.value"
                      :checked="isInArray(option.value, item.val)"
                    />
                  </label>
                  {{ option.value }}
                </label>
              </checkbox-group>
            </view>

            <view v-if="item.type === 'textarea'">
              <label>{{ item.title }}</label>
              <view class="uni-textarea">
                <textarea @blur="change($event, idx)" auto-height />
              </view>
            </view>
            <view v-if="item.type === 'textbox'">
              <label>{{ item.title }}</label>
              <view class="uni-textarea">
                <textarea @blur="change($event, idx)" auto-height />
              </view>
            </view>
            <view v-if="item.id === 'p1_GeLDZ'">
              <label>{{ item.title }}</label>
              <input
                class="uni-input"
                @input="change($event, idx)"
                placeholder="详细地址"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="btn-row">
        <button
          type="primary"
          class="primary"
          :loading="confirmBtnLoading"
          :disabled="confirmBtnLoading"
          @tap="openDialog"
        >
          提交模版
        </button>
      </view>
    </view>
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        type="input"
        title="确认"
        content="是否确认修改模板?"
        :before-close="true"
        @close="close"
        @confirm="confirm"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { univerifyLogin } from "@/common/univerify.js";
import MInput from "../../components/m-input.vue";
import { uniPopupDialog } from "@dcloudio/uni-ui";
import biaofunDatetimePicker from "@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue";
import biaofunRegion from "@/components/biaofun-region/biaofun-region.vue";

export default {
  computed: mapState(["forcedLogin", "hasLogin", "userName"]),
  components: {
    MInput,
    biaofunDatetimePicker,
    biaofunRegion,
    uniPopupDialog
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
      date: "",
      showModel: false,
      confirmBtnLoading: false,
    };
  },
  onLoad() {
    console.log("Page 'main' has loaded.");

    this.getDateFormat();
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
          // console.log("success info", e);
          var res = e.data;
          console.log("/getUserInfo/: ", res);
          if (res.code === 0) {
            // console.log(res);
            this.region.push(res.sheng);
            this.region.push(res.shi);
            this.region.push(res.xian);
            this.address = res.address;
          } else {
            this.$errorCode(res.code, res.msg);
          }
        },
      });
      this.$request({
        method: "GET",
        url: "/getModel/",
        success: (e) => {
          // console.log("success", e);
          var res = e.data;
          if (res.code === 0) {
            console.log(res);
            this.auto = res.is_auto_flag;
            this.defaultModel = res.default_model_flag;
            this.modelList = this.convertModel(res.model);
          } else {
            this.$errorCode(res.code, res.msg);
          }
        },
      });
    } else {
      this.guideToLogin();
    }
  },
  methods: {
    ...mapMutations(["login"]),
    openDialog() {
      // 打开弹出框
      this.$refs.popup.open();
    },
    confirm() {
      this.$refs.popup.close();
      this.confirmBtnLoading = true;
      this.submit();
    },
    close(done) {
      // 关闭弹出框
      this.$refs.popup.close();
      this.confirmBtnLoading = false;
    },
    isValidTemp(val) {
      if (parseFloat(val).toString() == "NaN") {
        console.log(parseFloat(val).toString());
        return false;
      } else if (parseFloat(val) < 25 || parseFloat(val) > 45) {
        return false;
      }
      return true;
    },
    getDateFormat() {
      var nowDate = new Date();
      var year = nowDate.getFullYear();
      var month =
        nowDate.getMonth() + 1 < 10
          ? "0" + (nowDate.getMonth() + 1)
          : nowDate.getMonth() + 1;
      var day =
        nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      var dateStr = year + "-" + month + "-" + day;
      this.today = dateStr;
      return dateStr;
    },
    change(e, idx) {
      this.modelList[idx]["val"] = e.detail.value;
      // 实在判断空列表的区别，用stringify函数暂时解决
      var hVal = JSON.stringify(this.modelList[idx]["hiddenValue"]);
      var val = JSON.stringify(e.detail.value);
      var children = this.modelList[idx]["child"];
      if (children != undefined) {
        // console.log(children);
        for (let i = 0; i < children.length; i++) {
          const child_id = children[i];
          for (let j = 0; j < this.modelList.length; j++) {
            const element = this.modelList[j];
            if (element["id"] === child_id) {
              element["hidden"] = hVal != val ? undefined : "true";
            }
          }
        }
      }
    },
    isInArray(e, array) {
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (e === element) {
          return true;
        }
      }
      return undefined;
    },

    // 检查模板填写情况
    checkValid() {
      // 判断地区不为空
      if (this.region === []) {
        uni.showModal({
          content: "所在地不能为空！",
          showCancel: false,
        });
        return false;
      }

      // 检查体温是否正常
      // if (!this.isValidTemp(this.temperature)) {
      //   uni.showModal({
      //     content: "体温填写异常！",
      //     showCancel: false,
      //   });
      //   return;
      // }

      for (let i = 0; i < this.modelList.length; i++) {
        const element = this.modelList[i];
        // 不支持国外信息填报
        if (element.id === "p1_DangQSTZK" && element.val === "不适") {
          uni.showModal({
            content: "特殊时期，如身体不适请及时到学校系统填报",
            showCancel: false,
          });
          return false;
        }
        // 不支持国外信息填报
        if (element.id === "p1_GuoNei" && element.val === "国外") {
          uni.showModal({
            content: "暂不支持国外填报",
            showCancel: false,
          });
          return false;
        }
        // 显示的文本框不为空
        // 新增的国内国外城市除外
        if (
          element.id != "p1_DaoXQLYGJ" &&
          element.id != "p1_DaoXQLYCS" &&
          element.hidden === undefined &&
          element.val === "" &&
          element.title != undefined &&
          (element.type === "textbox" || element.type === "textarea")
        ) {
          uni.showModal({
            content: element.title + "未填写",
            showCancel: false,
          });
          return false;
        }
      }

      return true;
    },
    submit() {
      if (!this.checkValid()) {
        this.confirmBtnLoading = false;
        return;
      }
      var model = [];
      // console.log(this.modelList);
      for (let i = 0; i < this.modelList.length; i++) {
        const element = this.modelList[i];
        // if (element.type === 'button' ||
        //     element.type === 'panel' ||
        //     element.type === 'label'
        // ) {
        //   continue;
        // }
        let e = {
          id: element.id,
          name: element.name,
          type: element.type,
          val: element.val,
          hidden: element.hidden,
        };
        if (e.id === "p1_XiangXDZ") {
          e.hidden = undefined;
        }
        // 隐藏的元素不上传
        if (e.hidden === "true") {
          continue;
        }
        model.push(e);
      }
      console.log("model", model);
      const data = {
        model: JSON.stringify(model),
        location: {
          sheng: this.region[0],
          shi: this.region[1],
          xian: this.region[2],
          address: this.address,
        },
      };
      // console.log("submit", data);
      let _self = this
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
            // console.log(res);
            uni.showToast({
              icon: "none",
              title: "提交成功",
            });
          } else {
            this.$errorCode(res.code, res.msg);
          }
        },
        fail(e) {
          uni.showModal({
            content: e.data.msg,
            showCancel: false,
          });
        },
        complete(e) {
          console.log("complete", _self.confirmBtnLoading);
          _self.confirmBtnLoading = false;
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
          this.$errorCode(e.data.code, e.data.msg);
        },
      });
    },
    switchChangeDefault: function (e) {
      // console.log("switch1 发生 change 事件，携带值为", e.detail.value);
      this.defaultModel = e.detail.value;
      this.$request({
        method: "GET",
        url: "/allowDefaultModel/", //是否使用默认模板
        data: {
          default_model_flag: this.defaultModel ? 1 : 0,
        },
        success: (e) => {
          console.log("success", e);
          this.$errorCode(e.data.code, e.data.msg);
        },
      });
    },
    strToJson: function (str) {
      return JSON.parse(str.replace(/'/g, '"').replace(/\\/g, ""));
    },

    convObj: function (obj) {
      var ret = {};
      var content = JSON.parse(
        obj.content.replace(/'/g, '"').replace(/\\/g, "").replace(/None/g, '""')
      );
      ret["id"] = content.id;
      ret["name"] = content.name;
      ret["hidden"] = content.hidden;
      ret["val"] = "";
      ret["type"] = obj.type;
      ret["child"] = content.hiddenChildren;
      switch (obj.type) {
        case "panal":
        case "numberbox":
          break;
        case "checkbox":
          ret["val"] = content.checked === "true" ? ["true"] : [];
          ret["hiddenValue"] = content.hiddenValue === "true" ? ["true"] : [];
          ret["prop"] = {
            checked: content.checked === "true",
            text:
              content.inputLabel != undefined
                ? content.inputLabel
                : content.fieldLabel,
          };
          break;
        case "radiobuttonlist":
          ret["title"] = content.fieldLabel;
          ret["val"] = content.SelectedValue;
          ret["hiddenValue"] = content.hiddenValue;
          ret["prop"] = {
            options: [],
          };
          for (let i = 0; i < content.F_Items.length; i++) {
            ret["prop"]["options"].push({
              value: content.F_Items[i][0],
              text: content.F_Items[i][1],
            });
          }
          break;
        case "checkboxlist":
          ret["title"] = content.fieldLabel;
          ret["val"] = content.SelectedValueArray;
          ret["prop"] = {
            checked: content.checked,
            options: [],
          };
          for (let i = 0; i < content.F_Items.length; i++) {
            ret["prop"]["options"].push({
              value: content.F_Items[i][0],
              text: content.F_Items[i][0],
            });
          }
          break;
        case "label":
          ret["text"] = content.value;
          break;
        case "textbox":
          if (ret["id"] === "p1_XiangXDZ") {
            ret["hidden"] = "true";
            break;
          }
          ret["title"] = content.fieldLabel;
          break;
        case "textarea":
          ret["title"] = content.fieldLabel;
          break;
        case "dropdownlist":
          // 正常情况用不到，但是他用下拉框处理是否了，特殊处理
          if (content.id != "p1_QueZHZJC") {
            break;
          }
          ret["title"] = content.fieldLabel;
          ret["val"] = content.SelectedValueArray[0];
          ret["prop"] = {
            multiple: false,
            localdata: [],
          };
          for (let i = 0; i < content.F_Items.length; i++) {
            ret["prop"]["localdata"].push({
              value: content.F_Items[i][0],
              text: content.F_Items[i][0],
            });
          }
          break;
        case "datepicker":
          ret["val"] = this.today === undefined ? "" : this.today;
          ret["title"] = content.fieldLabel;
          ret["prop"] = {
            start: "2021-01-01",
            end: this.today,
          };
          break;
        default:
          break;
      }
      return ret;
    },

    convertModel: function (model) {
      var retObj = [];
      for (let i = 0; i < model.length; i++) {
        // console.log("model[i]", model[i]);
        var result = this.convObj(model[i]);
        retObj.push(result);
      }
      // console.log("retObj", retObj);
      return retObj;
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
  color: gray;
  margin: 20px;
}

.ul > view {
  line-height: 25px;
}
</style>
