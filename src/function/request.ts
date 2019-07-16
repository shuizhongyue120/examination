import '@tarojs/async-await'
import Taro from '@tarojs/taro'

export const sendRequest = function (method, url, data) {
    let token = Taro.getStorageSync("access_token");
    return Taro.request({
        url,
        method,
        data,
        header: {
            ​ "Authorization": token || "1111111", //#未注册的时候随便填一个值，后面认证成功以后传入返回的第三方token,
            ​ "Content-Type": "application/json" ​
        }
    })
}