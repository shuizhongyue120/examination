import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Swiper, SwiperItem, Button} from '@tarojs/components'
import {connect} from '@tarojs/redux'

import './index.css'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性 需要显示声明
// connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props 这样才能完成类型检查和 IDE
// 的自动提示 使用函数模式则无此限制 ref:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props : IProps;
}

@connect(({counter}) => ({counter}), (dispatch) => ({}))
class Index extends Component<IProps, any>{
  constructor(props, context){
    super(props, context);
    this.state = {
      showLoginBtn:Taro.getStorageSync("userenable") !== "1"
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
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
   let showLoginBtn = this.state.showLoginBtn;
    console.log(showLoginBtn);
    return (
      <View className='index'>
        <Swiper
          className='test-h'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay>
          <SwiperItem style="background-color:red;">
            <View className='demo-text-1'>1</View>
          </SwiperItem>
          <SwiperItem style="background-color:gray;">
            <View className='demo-text-2'>2</View>
          </SwiperItem>
          <SwiperItem style="background-color:blue;">
            <View className='demo-text-3'>3</View>
          </SwiperItem>
        </Swiper>

        <View class="btn_group">
          <View
            class="btn_item"
            style="background-color: #409eff;"
            onClick={this
            .enterExamHandle
            .bind(this)}>模拟考试</View>
          <View class="btn_item" style="background-color: #5daf34;">真题解析</View>
          <View class="btn_item" style="background-color: #e6a23c;">错题集</View>
          <View class="btn_item" style="background-color: #07c160;">收藏</View>
        </View>
        {showLoginBtn && <View style="text-align:center;">
          <Button type="primary" size="mini" open-type="getUserInfo" onGetUserInfo={this.getUserInfo}>
            点击授权
          </Button>
        </View>
}
        <View class="adv_wrap">广告位</View>
      </View>
    );

  }
  private getUserInfo(data) {
    console.log("getUserInfo", data);
    this.setState({showLoginBtn:false});
  }

  private enterExamHandle() {
    console.log("enterExamHandle");
    Taro.navigateTo({url: "../book/index"});
  }
}
