let info = null;
/*
0- 初始值 loading 状态
-1 未授权
200 登录成功 未 获取用户信息
201 登录成功 拿到用户信息
2010 退出登录
1 未知异常
401，表示账号的认证信息已经过期，需要重新发起认证

{
4011	"error_code": "invalid_wxapp_code",
	"message": "Invalid wxapp code",
	"text": "无效的code"
}

{
4010	"error_code": "wxapp_not_registered",
	"message": "The wxapp not registered",
	"text": "微信没有注册"
}

403，表示账号还未通过管理员的认证
404，4010：没有找到用户信息(没有注册)
500 网络连接失败，服务不可用等等
*/
let loginCode = 0;



export function setUserInfo(data){
    console.log("setUserInfo:", data);
    if(!data){
        info = null;
    }else {
        info = Object.assign(data);
    }
}

export function getUserInfo(){
    console.log("getUserInfo:", info);
    return info;
}

export function setLoginCode(code){
    console.log("setLoginCode:", code);
    loginCode = code;
}

export function getLoginCode(){
    console.log("getLoginCode:", loginCode);
    return loginCode;
}