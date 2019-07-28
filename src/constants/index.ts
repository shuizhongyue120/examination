export let getLoginUrl = () => "auth/accounts/wxapp";
export let getTokenUrl = () => "auth/oauth/token";
export let getInfoUrl = () => "auth/accounts/self";

export let error401Msg2code = {
    "wxapp_not_registered": 4010,
    "invalid_wxapp_code": 4011,
    "invalid_token": 4012
}