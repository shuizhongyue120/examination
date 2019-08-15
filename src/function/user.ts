import Taro, {Component, Config} from '@tarojs/taro'
import {getLoginUrl, getTokenUrl, getInfoUrl, error401Msg2code} from "../constants";

import {sendRequest} from "./api";
import { setUserInfo } from '../global';

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
            return sendRequest("POST", getTokenUrl(), {
                code,
                username: encryptedData,
                password: iv
            })
        })
        .then(data => {
            setUserInfo(data.statusCode);
            Taro.setStorageSync("loginover", data.statusCode);
            if (201 === data.statusCode) {
                Taro.setStorageSync("access_token", data.data.access_token);
                Taro.setStorageSync("account_id", data.data.account_id);
                Taro.showToast({title: "登录成功！"});
                return new Promise((resolve)=>resolve(true));
            } else if (401 === data.statusCode) { //无效
                let code = error401Msg2code[data.data.error_code];
                Taro.setStorageSync("loginover", code);
                setUserInfo(code);
                return new Promise((resolve)=>resolve(true));
            } else if (404 === data.statusCode) { //账号信息没有找到
                //
                return new Promise((resolve)=>resolve(false));
            } else {
                Taro.setStorageSync("loginover", 1);
                setUserInfo(1);
                Taro.showToast({title: "获取TOKEN异常", icon: "none"});
                return new Promise((resolve)=>resolve(false));
            }
        })
        .catch((res = {}) => {
            Taro.showToast({
                title: res.errMsg || "",
                icon: "none"
            });
            setUserInfo(500);
            return new Promise((resolve)=>resolve(false));
        });
}
