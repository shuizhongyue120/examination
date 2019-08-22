import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {
  View,
  Swiper,
  SwiperItem,
  Button,
  Picker,
  Text,
  Image
} from '@tarojs/components'
import {AtNoticebar} from 'taro-ui'
import {connect} from '@tarojs/redux'
import {fetchInfo, isLogin, fetchCourses} from "../../actions/user"
import {goLogin, getLoginToken, fetchUserInfo} from "../../function/user"
import {sendRequest} from "../../function/api"

import {getUserInfo, setUserInfo, getLoginCode, setLoginCode} from "../../global";
import './index.css'

//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性 需要显示声明
// connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props 这样才能完成类型检查和 IDE
// 的自动提示 使用函数模式则无此限制 ref:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

/* const ImgsUrl : string[] = [
  "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/icon/index/%E8%80%83%E8" +
      "%AF%95%20(2).png?sign=9254dd2e2b96a3263be951ff24d0c80d&t=1564666435",
  "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/icon/index/%E8%A7%A3%E6" +
      "%9E%90%20(1).png?sign=f4606e3223d85060628b01089394080a&t=1564667851",
  "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/icon/index/%E9%94%99%E9" +
      "%A2%98%20(1).png?sign=d4535be0d89f73a9fbe97647da9c04f1&t=1564667885",
  "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/icon/index/%E6%94%B6%E8" +
      "%97%8F.png?sign=f86f810f1a1b4d121c02b2a6258097f0&t=1564666522"
];
 */
const ImgsUrl : string[] = [
  "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/exam/index-icon/exam.pn" +
      "g",
  "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/exam/index-icon/answer." +
      "png",
  "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/exam/index-icon/error.p" +
      "ng",
  "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/exam/index-icon/favor.p" +
      "ng"
];

type PageStateProps = {
  user: {
    info: null,
    logined: false,
    courses: undefined
  }
}
type PageDispatchProps = {
  fetchInfo: () => any,
  isLogin: () => any;
  fetchCourses: () => any;
}

type PageOwnProps = {}
type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props : IProps;
}

@connect(({user}) => ({user}), (dispatch) => ({
  fetchInfo() {
    dispatch(fetchInfo());
  },
  isLogin() {
    dispatch(isLogin());
  },
  fetchCourses() {
    dispatch(fetchCourses());
  }
}))
class Index extends Component < IProps,
any > {

  private timer = 0;
  constructor(props, context) {
    super(props, context);
    this.state = {
      code: 0,
      info: undefined,
      courses: undefined,
      course: "",
      url: "",
      method: "GET",
      param: ""
    };
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config : Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps(nextProps) {
    let course = this.props.user.courses;
    let nextcourses = nextProps.user.courses;

    if (JSON.stringify(course) === JSON.stringify(nextcourses) && nextcourses) {
      this.setState({
        code: 201
      });
    } else {
      let loginCode = getLoginCode();
      this.setState({
        courses: nextcourses,
        code:loginCode
      });
    }

  }

  pullHandle() {
    this.timer = setInterval(() => {
      this.checkCode();
    }, 50)
  }

  private checkCode() {
    let loginCode = getLoginCode();
    let info = getUserInfo();
    if (loginCode == 201 && info) {
      clearInterval(this.timer);
      this.setState({code: loginCode, info});
      this
        .props
        .fetchCourses();
      return;

    }
    if (loginCode < 0 || 4010 == loginCode || 4011 == loginCode || 4012 == loginCode) { //未授权,未注册
      clearInterval(this.timer);
      this.setState({code: loginCode});
      Taro.switchTab({url: "../../pages/my/index"});
      return;
    }
    if (loginCode != 0 && loginCode != 200) {
      clearInterval(this.timer);
      this.setState({code: loginCode, course: undefined, info: undefined});
      return;
    }

  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidShow() {
    this.pullHandle();
  }

  componentDidHide() {}

  private getNoticeMsg() {
    let {info, code} = this.state;
    let res = {
      majorStr: "",
      cls: ""
    };

    if (code === 403) {
      res = {
        majorStr: "您还未通过审核，请联系管理员。",
        cls: ""
      };
    } else if (code === 0 || code === 201) {
      if (info) {
        res = {
          majorStr: info.major_name,
          cls: "act"
        };
      }
    }

    return res;
  }

  render() {
    let {code, url, method, param} = this.state;
    let notice = this.getNoticeMsg();
    return (
      <View className='index'>
        <Swiper
          className='m_swiper'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay>
          <SwiperItem>
            <image
              src="cloud://examination-4a5460.6578-examination-4a5460/exam/banner/1.jpg"></image>
          </SwiperItem>
          <SwiperItem>
            <image
              src="cloud://examination-4a5460.6578-examination-4a5460/exam/banner/1.jpg"></image>
          </SwiperItem>
        </Swiper>
        {notice.majorStr && <View class="marjor_notice">
          {"act" === notice.cls
            ? <AtNoticebar className="act" icon="bell">{notice.majorStr}</AtNoticebar>
            : <AtNoticebar icon="bell">{notice.majorStr}</AtNoticebar>}
        </View>}
        {(201 === code)
          ? this.renderVerifyGroup()
          : this.renderNoAllowGroup()}

        <View style="text-align:center;">
          {-1 === code && <Button open-type="getUserInfo" onGetUserInfo={this.getUserInfo}>
            授权登录
          </Button>
}
          {(4010 === code || 404 === code) && <Button open-type="getUserInfo" onGetUserInfo={this.getUserInfo}>
            一键登录
          </Button>
}
          {(4011 === code || 1 === code || 2010 === code) && <Button
            open-type="getUserInfo"
            onGetUserInfo={this
            .loginHandle
            .bind(this)}>
            重新登录
          </Button>
}
        </View>

        {/*  <View style="text-align:center;">
          <Input
            type='text'
            placeholder='接口名称，如auth/accounts/self'
            value={url}
            onChange={this
            .onUrlHandle
            .bind(this)}
            style="border:1px solid #dbdbdb;width:90%;height:32px;"/>
          <Input
            type='text'
            placeholder='请求方式'
            value={method}
            onChange={this
            .onMethodHandle
            .bind(this)}
            style="border:1px solid #dbdbdb;width:90%;margin:2PX 0; height:32px; "/>
          <Input
            type='text'
            placeholder="参数，如name:1,job:ccc"
            value={param}
            onChange={this
            .onParamHanle
            .bind(this)}
            style="border:1px solid #dbdbdb; width:90%;height:32px; "/>
          <Button
            style="margin-top:10px;"
            type="primary"
            size="mini"
            onClick={this
            .testInterface
            .bind(this)}>
            调试接口
          </Button>
        </View> */}

        {/* <View class="adv_wrap">广告位</View> */}
      </View>
    );

  }

  private renderNoAllowGroup() {
    return <View class="btn_groups">
      <View class="btn_wrap" onClick={this.noAllowHandle}>
        <View>
          <Image class="btn_img" src={ImgsUrl[0]}/>
        </View>
        <Text>模拟考试</Text>
      </View>
      <View class="btn_wrap" onClick={this.noAllowHandle}>
        <View>
          <Image class="btn_img" src={ImgsUrl[1]}/>
        </View>
        <Text>真题解析</Text>
      </View>

      <View class="btn_wrap" onClick={this.noAllowHandle}>
        <View>
          <Image class="btn_img" src={ImgsUrl[2]}/>
        </View>
        <Text>错题集</Text>
      </View>
      <View class="btn_wrap" onClick={this.noAllowHandle}>
        <View>
          <Image class="btn_img" src={ImgsUrl[3]}/>
        </View>
        <Text>收藏夹</Text>
      </View>
    </View>
  }
  private noAllowHandle() {
    let {
      courses = [],
      code
    } = this.state;
    if (403 === code) {
      Taro.showToast({title: "您还未通过审核，请联系管理员。", icon: "none"});
      return;
    }
    if (0 != code && 201 != code) {
      Taro.showToast({title: "未注册或登录失败，暂时无法使用该功能。", icon: "none"});
      return;
    }

    if (0 === courses.length) {
      Taro.showToast({title: "暂无课程，请联系管理员。", icon: "none"});
      return;
    }
  }
  private renderVerifyGroup() {
    let {
      courses = [],
      course
    } = this.state;

    return <View class="btn_groups">
      <Picker
        class="btn_wrap"
        value={course}
        data-idx="0"
        mode='selector'
        range={courses.map(item => item.course_name)}
        onChange={this
        .enterExamHandle
        .bind(this)}>
        <View>
          <Image class="btn_img" src={ImgsUrl[0]}/>
        </View>
        <Text>模拟考试</Text>
      </Picker>
      <Picker
        class="btn_wrap"
        value={course}
        data-idx="1"
        mode='selector'
        range={courses.map(item => item.course_name)}
        onChange={this
        .enterExamHandle
        .bind(this)}>
        <View>
          <Image class="btn_img" src={ImgsUrl[1]}/>
        </View>
        <Text>真题解析</Text>
      </Picker>
      <Picker
        class="btn_wrap"
        value={course}
        mode='selector'
        range={courses.map(item => item.course_name)}
        onChange={this
        .enterErrorHandle
        .bind(this)}>
        <View>
          <Image class="btn_img" src={ImgsUrl[2]}/>
        </View>
        <Text>错题集</Text>
      </Picker>
      <Picker
        class="btn_wrap"
        value={course}
        mode='selector'
        range={courses.map(item => item.course_name)}
        onChange={this
        .enterFavorHandle
        .bind(this)}>
        <View>
          <Image class="btn_img" src={ImgsUrl[3]}/>
        </View>
        <Text>收藏夹</Text>
      </Picker>
    </View>
  }
  private getUserInfo(data) {
    let {encryptedData, iv} = data.detail;
    //重新走一遍注册登录
    goLogin(encryptedData, iv).then(({statusCode, data={}}) => {
      if (201 === statusCode ||(400 ===statusCode&&(data.error_code==="wxapp_already_registered"))) {//注册成功
        getLoginToken(encryptedData, iv).then(isSuc => {
          this.setLoginAndInfo(getLoginCode());
          if (isSuc) {
            fetchUserInfo().then(data => {
              if(200 === data.statusCode){
                this.setLoginAndInfo(201, data.data);
                setUserInfo(data.data);
                this
                .props
                .fetchCourses();
                return;
              }
    
              this.setLoginAndInfo(data.statusCode);
            }).catch(() => {
              setUserInfo("");
              Taro.showToast({title: "读取用户信息失败，请重试", icon: "none"})
            })
          }else {
            //to do
          }
        });
      } else {
        setLoginCode(404);
        Taro.showToast({title: "操作失败，请重试：" + statusCode, icon: "none"})
      }

    });
  }
  private setLoginAndInfo(code = -1, info?:any) {
    setLoginCode(code);
    this.setState({code, info});
  }
  private loginHandle(data) {
    let {encryptedData, iv} = data.detail;
    getLoginToken(encryptedData, iv).then(isSuc => {
      this.setLoginAndInfo(getLoginCode());
      if (isSuc) {
        fetchUserInfo().then(data => {
          if(200 === data.statusCode){
            setLoginCode(201); this.setLoginAndInfo(201, data.data);
            setUserInfo(data.data);
            this
            .props
            .fetchCourses();
            return;
          }

          this.setLoginAndInfo(data.statusCode);
        }).catch(() => {
          setUserInfo("");
          Taro.showToast({title: "读取用户信息失败，请重试", icon: "none"})
        })
      }else {
        //todo
      }
    });
  }
  private enterExamHandle(e) {
    let id = e.detail.value;
    let course = this.state.courses[id];
    let idx = e.currentTarget.dataset.idx;

    if (course) {
      Taro.navigateTo({
        url: "../book/index?type=" + idx + "&id=" + course.course_id
      });
    }
  }

  private enterFavorHandle(e) {
    let idx = e.detail.value;
    let course = this.state.courses[idx];
    if (course) {
      Taro.navigateTo({
        url: "../favor/index?name=" + course.course_name
      });
    }
  }

  private enterErrorHandle(e) {
    let idx = e.detail.value;
    let course = this.state.courses[idx];
    if (course) {
      Taro.navigateTo({
        url: "../errorbook/index?id=" + course.course_id
      });
    }
  }

  private onUrlHandle(e) {
    this.setState({url: e.detail.value});
  }
  private onMethodHandle(e) {
    this.setState({method: e.detail.value});
  }
  private onParamHanle(e) {
    this.setState({param: e.detail.value});
  }

  private testInterface() {
    let {url, method, param} = this.state;
    if (!url) {
      Taro.showToast({title: "url 不合法"});
      return;
    }
    let list = param.split(",");
    let obj = {}
    list.forEach(element => {
      let list = element.split(/：|:/);
      obj[list[0]] = list[1];
    });

    sendRequest(method, "http://kobejia.club:7778/" + url, obj).then(data => {});
  }
}
