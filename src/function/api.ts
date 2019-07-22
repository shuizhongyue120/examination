import '@tarojs/async-await'
import Taro from '@tarojs/taro'

const base_url = "http://kobejia.club:7778/";

export const sendRequest = function (method, url, data) {
    let token = Taro.getStorageSync("access_token");
    return Taro.request({
        url: base_url + url,
        method,
        data,
        header: {
            ​ "Authorization": token || "1111111", //#未注册的时候随便填一个值，后面认证成功以后传入返回的第三方token,
            ​ "Content-Type": "application/json" ​
        }
    })
}

export const favorPaper = (id) => {
    return sendRequest("POST", "", {id});
}



export const fetchBookPapers = (data) => {
    return sendRequest("GET", "v1/self/subjects/category", data);
}


export const fetchPapers = (data) => {
    return sendRequest("GET", "v1/self/subjects", data);
}