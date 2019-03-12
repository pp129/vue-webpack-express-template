import storage from "./storage";
import { axios } from "./axios";
let conf = require("@conf");
let moment = require("moment");

let _ = require("lodash");
let urlUtil = require("url");
let querystring = require("querystring"); //解析参数的库
export const util = {
    use(vue) {
        this.vue = vue;
    },
    vue: null,
    /**
     * 移除对象中值为空的键值对
     * @param obj
     */
    objectRemoveValueIsNull(obj) {
        for (let i in obj) {
            let item = obj[i];
            if (this.isNull(item)) {
                delete obj[i];
            }
        }
    },
    /**
     * 判断为空
     * @param arg1
     * @returns {boolean}
     */
    isNull(arg1) {
        return !arg1 && arg1 !== 0 && typeof arg1 !== "boolean";
    },
    /**
     * 判断对象为无属性对象
     * @param e
     * @returns {boolean} 如果为空对象，返回true  如果为非空对象，返回false
     */
    isEmptyObject(e) {
        for (let t in e) return !1;
        return !0;
    },
    /**
     * 计算年龄
     * @param birthday   1999-10-08
     * @returns {Number}
     */
    getAge(birthday) {
        let birthdayTimestamp = moment(birthday, "YYYY-MM-DD")
            .toDate()
            .getTime();
        let nowTimestamp = new Date().getTime();
        let tempTime = nowTimestamp - birthdayTimestamp;
        let age = parseInt(tempTime / 1000 / 60 / 60 / 24 / 365);
        return age;
    },
    /**
     * 回车键事件
     * @param e  事件
     * @param fn  回调函数
     */
    keydownEnter(e, fn) {
        let theEvent = e || window.event;
        let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code === 13) {
            fn();
        }
    },
    /**
     * 超出省略
     * @param s 字符串
     * @param len 最大长度
     * @returns {String}
     */
    beyondShowDot(s, len) {
        if (s) {
            let stringLength = s.length;
            if (stringLength <= len) {
                return s;
            } else {
                return s.substr(0, len) + "...";
            }
        } else {
            return "";
        }
    },
    /*set复制初始数据
     *get获取初始数据和最终数据判断是否有更改
     * */
    setStorageData(data) {
        let storageData = _.clone(data);
        return storageData;
    },
    getStorageData(data, copyData) {
        let isReminding = _.isEqual(copyData, data);
        return isReminding;
    },
    /**
     * 通过键和键值获取键值所在对象
     * @param obj
     * @param key
     * @param value
     * @return {*}
     */
    getItemByValue(obj, key, value) {
        for (let item of obj) {
            if (item[key] === value) {
                return item;
            }
        }
        return null;
    },
    trim(str) {
        str = _.trim(str);
        str = str.replace(/\u202D/g, "");
        str = str.replace(/\u202C/g, "");
        return str;
    },
    verifyResponse(data) {
        if (data && data.data && data.data.code) {
            if (data.data.code === 200) {
                if (data.data.data || data.data.data === 0) {
                    return data.data.data;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    verifyResponseDateNull(data) {
        if (data && data.data && data.data.code && data.data.code === 200) {
            console.log(data.data.code);
            if (data.data.code === 200) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    noNoneGetParams(params, isJSON) {
        let result = {};
        params = params || {};

        for (let key in params) {
            if (
                params[key] !== "" &&
                params[key] !== null &&
                typeof params[key] !== "undefined"
            ) {
                result[key] = params[key];
            }
        }
        if (isJSON) {
            return result;
        } else {
            return querystring.stringify(result);
        }
    },
    // 数字前补零
    addZero(num, length) {
        return (Array(length).join(0) + num).slice(-length);
    },
    // 获取时间区间各个月份
    getMonthArray(data) {
        let timeline = [];
        let minMonth = null;
        let maxMonth = null;
        for (let item of data) {
            let itemMoment = moment(item);
            if (!minMonth) {
                minMonth = itemMoment;
                maxMonth = itemMoment;
                continue;
            }
            if (itemMoment.isBefore(minMonth)) {
                minMonth = itemMoment;
                continue;
            }
            if (itemMoment.isAfter(maxMonth)) {
                maxMonth = itemMoment;
                continue;
            }
        }
        let formatMinMonth = minMonth.format("YYYY-MM");
        let formatMaxMonth = maxMonth.format("YYYY-MM");
        timeline.push(formatMaxMonth);
        while (formatMaxMonth !== formatMinMonth) {
            let date = moment(formatMaxMonth).subtract(1, "month");
            let dateMonthYear = date.format("YYYY-MM");
            timeline.push(dateMonthYear);
            formatMaxMonth = dateMonthYear;
        }
        timeline.reverse();
        return timeline;
    },
    setTitle(s) {
        document.title = "" + (s ? "-" + s : "");
    },
    toThousand(data) {
        let value = data.toString();
        let trans = "";
        while (value.length > 3) {
            trans = "," + value.slice(-3) + trans;
            value = value.slice(0, value.length - 3);
        }
        if (value) {
            return value + trans;
        }
    },
    handleSuccess(res, alertMessage) {
        let data = util.verifyResponse(res);
        if (data) {
            return data;
        } else {
            if (alertMessage) {
                this.$message.error(res.data.message);
            }
            return false;
        }
    },
    handleSuccessDateNull(res, alertMessage) {
        let data = util.verifyResponseDateNull(res);
        if (data) {
            return true;
        } else {
            if (alertMessage) {
                this.$message.error(res.data.message);
            }
            return false;
        }
    },
    handleFail(e) {
        console.error(e);
        return false;
    },
    handleError(e) {
        if (e.response && e.response.status) {
            if (e.response.status === 401) {
                if (window.location.href.indexOf("/#/login") !== -1) {
                    this.vue.$message.error("登录过期，请重新登录");
                    storage.setSession("historyUrl", window.location.href);
                    window.location.href = "/#/login";
                }
            }
        }
        // console.error(e);
        return false;
    },
    /**
     * 保存日志到后端
     * @param moduleName
     * @param handle
     * @param content
     */
    async log(moduleName, handle, content) {
        return await axios
            .post(conf.api + "/tSysOperateLog/addTSysOperateLog", {
                moduleName,
                operateType: handle,
                operateContent: content,
                operateUrl: this.vue.$route.fullPath
            })
            .then(res => {
                return this.verifyResponse(res);
            })
            .catch(e => {
                console.error(e);
                return false;
            });
    },
    async uploadBase64(base64, fileType, uploadType) {
        let data = {
            fileType,
            uploadType
        };
        let formData = new FormData();
        formData.append("fileType", fileType);
        formData.append("uploadType", uploadType);
        formData.append("base64", base64);
        let config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };
        return await axios
            .post(conf.api + "/file/uploadFileBase64", formData, config)
            .then(res => {
                return this.verifyResponse(res);
            })
            .catch(e => {
                console.error(e);
                return false;
            });
    }
};
