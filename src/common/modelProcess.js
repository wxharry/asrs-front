
export function strToJson(str) {
    return JSON.parse(str.replace(/'/g, '\"').replace(/\\/g, ''))
}

function isEmptyObject(obj) {
    for (var key in obj) {
        return false
    };
    return true
};


function convObj(obj, _self) {
    var ret = {}
    var content = strToJson(obj.content)
    ret["id"] = content.id
    ret["name"] = content.name
    ret['hidden'] = content.hidden
    ret['val'] = ""
    ret['type'] = obj.type
    if (content.id === "p1_BaoSRQ") {
        return ret
    }
    switch (obj.type) {
        case "panal":
            break;
        case "numberbox":
            break;
        case "checkbox":
            ret["newType"] = "uniDataCheckbox"
            ret["prop"] = {
                multiple: true,
                checked: content.checked,
                "localdata": [{
                    "value": "0",
                    "text": content.inputLabel != undefined ? content.inputLabel : content.fieldLabel
                },]
            }
            if (content.hiddenChildren != undefined) {
                ret["change"] = function (e) {
                    // console.log("e", e.detail.value);
                    for (let i = 0; i < content.hiddenChildren.length; i++) {
                        for (let j = 0; j < _self.modelList.length; j++) {
                            if (_self.modelList[j]["id"] === content.hiddenChildren[i]) {
                                _self.modelList[j].hidden = _self.modelList[j].hidden === undefined ? "true" : undefined
                            }
                        }
                        // var x = document.getElementById(content.hiddenChildren[i])
                        // if (x.attributes.hidden) {
                        //     x.removeAttribute("hidden")
                        // } else {
                        //     x.setAttribute("hidden", true)
                        // }
                    }

                };
            }
            break;
        case "radiobuttonlist":
            ret["title"] = content.fieldLabel;
            ret["newType"] = "uniDataCheckbox";
            ret['val'] = content.SelectedValue;
            // console.log("hc", content.hiddenChildren);
            if (content.hiddenChildren != undefined) {
                ret["change"] = function (e) {
                    // console.log("bushi", _self["bushi"]);
                    // console.log("e", e.detail.value);
                    for (let i = 0; i < content.hiddenChildren.length; i++) {
                        for (let j = 0; j < _self.modelList.length; j++) {
                            if (_self.modelList[j]["id"] === content.hiddenChildren[i]) {
                                _self.modelList[j].hidden = _self.modelList[j].hidden === undefined ? "true" : undefined
                            }
                        }
                        // var x = document.getElementById(content.hiddenChildren[i])
                        // if (x.attributes.hidden) {
                        //     x.removeAttribute("hidden")
                        // } else {
                        //     x.setAttribute("hidden", true)
                        // }
                    }
                };
            }

            ret["prop"] = {
                // value: content.SelectedValue,
                multiple: false,
                checked: content.checked,
                "localdata": [],
            };
            for (let i = 0; i < content.F_Items.length; i++) {
                ret["prop"]["localdata"].push({ "value": content.F_Items[i][0], "text": content.F_Items[i][0] })
            }
            break;
        case "checkboxlist":
            ret["title"] = content.fieldLabel
            ret["newType"] = "uniDataCheckbox"
            ret['val'] = content.SelectedValue;
            ret["prop"] = {
                multiple: true,
                checked: content.checked,
                "localdata": [],

            }
            for (let i = 0; i < content.F_Items.length; i++) {
                ret["prop"]["localdata"].push({ "value": content.F_Items[i][0], "text": content.F_Items[i][0] })
            }
            break;
        case "label":
            ret["newType"] = "uniNoticeBar"
            ret["prop"] = {
                text: content.value
            }
            break;
        case "textbox":
            if (ret['id'] === 'p1_XiangXDZ') {
                break;
            }
            ret['title'] = content.fieldLabel
            ret["newType"] = "MInput"
            ret["prop"] = {
                type: "text",
                class: "input-group"
            }
            break;
        case "textarea":
            ret['title'] = content.fieldLabel
            ret["newType"] = "MInput"
            ret["prop"] = {
                type: "text",
                class: "input-group"
            }
            break;
        case "dropdownlist":
            // 正常情况用不到，但是他用下拉框处理是否了，特殊处理
            if (content.id != "p1_QueZHZJC") {
                break;
            }
            ret["title"] = content.fieldLabel;
            ret["newType"] = "uniDataCheckbox";
            ret['val'] = content.SelectedValueArray[0];
            ret["prop"] = {
                multiple: false,
                "localdata": [],
            };
            for (let i = 0; i < content.F_Items.length; i++) {
                ret["prop"]["localdata"].push({ "value": content.F_Items[i][0], "text": content.F_Items[i][0] })
            }
            break;
        case "datepicker":
            ret['newType'] = 'biaofunDatetimePicker';
            ret['prop'] = {
                defaultValue: content.Text,
                start: "2021-01-01",
                end: content.Text,
                fields:"day"
            };
            ret['val'] = content.Text;
            ret['title'] = content.fieldLabel
            ret["change"] = function (e) {
                console.log("change",e.f1);
                for (let j = 0; j < _self.modelList.length; j++) {
                    if (_self.modelList[j]["id"] === ret['id']) {
                        _self.modelList[j]['val'] = e.f1
                    }
                }
                
            };
            break;
        default:
            break;
    }
    return ret
}

export function convertModel(model, _self) {
    var retObj = []
    // console.log("this", _self);
    for (let i = 0; i < model.length; i++) {
        var result = convObj(model[i], _self)
        if (!isEmptyObject(result)) {
            retObj.push(result)
        }
    }
    return retObj
}

