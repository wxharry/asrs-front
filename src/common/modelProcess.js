
export function strToJson(str) {
    return JSON.parse(str.replace(/'/g, '\"').replace(/\\/g, ''))
}

function isEmptyObject(obj) {
    for (var key in obj) {
        return false
    };
    return true
};


function convObj(obj) {
    var ret = {}
    var content = strToJson(obj.content)
    ret["id"] = content.id
    ret["name"] = content.name
    ret['hidden'] = content.hidden
    ret['val'] = ""
    ret['type'] = obj.type
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
                        var x = document.getElementById(content.hiddenChildren[i])
                        if (x.attributes.hidden) {
                            x.removeAttribute("hidden")
                        } else {
                            x.setAttribute("hidden", true)
                        }
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
                    // console.log("e", e.detail.value);
                    for (let i = 0; i < content.hiddenChildren.length; i++) {
                        var x = document.getElementById(content.hiddenChildren[i])
                        if (x.attributes.hidden) {
                            x.removeAttribute("hidden")
                        } else {
                            x.setAttribute("hidden", true)
                        }
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
            ret['newType'] = 'biaofun-datetime-picker';
            ret['prop'] = {
                defaultValue: content.Text,
                start: "2000-02-03",
                end:"2100-10-28",
                fields:"day"
            };
            ret["change"] = function (e) {
                console.log(e);
            };
            break;
        default:
            break;
    }
    return ret
}

export function convertModel(model) {
    var retObj = []
    for (let i = 0; i < model.length; i++) {
        var result = convObj(model[i])
        if (!isEmptyObject(result)) {
            retObj.push(result)
        }
    }
    return retObj
}

