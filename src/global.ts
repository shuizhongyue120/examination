let info = null;
/*
0- 初始值
-1 未授权
201 登录成功
401，表示账号的认证信息已经过期，需要重新发起认证

{
	"error_code": "invalid_wxapp_code",
	"message": "Invalid wxapp code",
	"text": "无效的code"
}

{
	"error_code": "wxapp_not_registered",
	"message": "The wxapp not registered",
	"text": "微信没有注册"
}

403，表示账号还未通过管理员的认证
404：没有找到用户信息
500 网络连接失败，服务不可用等等
*/
let loginCode = 0;



export function setUserInfo(data){
    console.log("setUserInfo:", data);
    info = Object.assign(data);
}

export function getUserInfo(){
    return info;
}

export function setLoginCode(code){
    console.log("loginCode:", code);
    loginCode = code;
}

export function getLoginCode(){
    return loginCode;
}