import '@tarojs/async-await'
import Taro from '@tarojs/taro'

const base_url = "http://kobejia.club:7778/";

export const sendRequest = function (method, url, data) {
    let token = Taro.getStorageSync("access_token");
    return Taro.request({
        url: base_url + url,
        method,
        timeout: 8000,
        data,
        header: {
            ​ "Authorization": token || "1111111", //#未注册的时候随便填一个值，后面认证成功以后传入返回的第三方token,
            ​ "Content-Type": "application/json" ​
        }
    })
}

export const favorPaper = (course_id, subject_id, action) => {
    return sendRequest("POST", "v1/self/course/" + course_id + "/subject/" + subject_id + "/favorite", {action});
}

export const submitPaper = (course_id, subject_category, submits) => {
    return sendRequest("POST", "v1/self/course/" + course_id + "/exam", {subject_category, submits});
}

export const fetchErrorList = (course_id) => {
    return sendRequest("GET", "v1/self/course/" + course_id + "/exam/error", null);
}

export const fetchPaperResults = (course_id, exam_id, subject_category) => {
    return sendRequest("GET", "v1/self/course/" + course_id + "/exam", {subject_category, exam_id});
}

export const favorList = () => {
    return sendRequest("GET", "v1/self/favorites", null);
}

export const fetchCategory = (data) => {
    return sendRequest("GET", "v1/self/subjects/category", data);
}

export const fetchPapers = (data) => {
    return sendRequest("GET", "v1/self/subjects", data);
}