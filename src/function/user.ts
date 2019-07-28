import Taro, {Component, Config} from '@tarojs/taro'
import {getLoginUrl, getTokenUrl, getInfoUrl, error401Msg2code} from "../constants";

import {sendRequest} from "./api";

export const checkLogin = () => {
    return Taro.getStorageSync("access_token");
}

export const fetchUserInfo = () => {
    return sendRequest("GET", getInfoUrl(), undefined);
}

export const fetchUserCourses = () => {
    return sendRequest("GET", "v1/self/courses", undefined);
}

export const goLogin = (encryptedData, iv) => {
    return Taro
        .login()
        .then(({code}) => {
            console.log("login", {
                code,
                username: encryptedData,
                password: iv
            });
            return sendRequest("POST", getLoginUrl(), {
                code,
                username: encryptedData,
                password: iv
            })
        });
}

export const getLoginToken = (encryptedData, iv) => {
    return Taro
        .login()
        .then(({code}) => {
            console.log("token", {
                code,
                username: encryptedData,
                password: iv
            });
            return sendRequest("POST", getTokenUrl(), {
                code,
                username: encryptedData,
                password: iv
            })
        })
        .then(data => {
            console.log("token", data);
            Taro.setStorageSync("loginover", data.statusCode);
            if (201 === data.statusCode) {
                Taro.setStorageSync("access_token", data.data.access_token);
                Taro.setStorageSync("account_id", data.data.account_id);
                Taro.showToast({title: "登录成功！"});
            } else if (401 === data.statusCode) { //无效
                let code = error401Msg2code[data.data.error_code];
                Taro.setStorageSync("loginover", code);
            } else if (404 === data.statusCode) { //账号信息没有找到
                //
            } else {
                Taro.setStorageSync("loginover", 1);
                Taro.showToast({title: "获取TOKEN异常"});
            }
        })
        .catch((res = {}) => {
            console.log("getLoginToken", res);
            Taro.showToast({
                title: res.errMsg || ""
            });
        });
}
