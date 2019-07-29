import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text} from '@tarojs/components'
import {AtDivider, AtActivityIndicator} from 'taro-ui'

import {connect} from '@tarojs/redux'

import {fetchErrorBook} from '../../actions/error'

import './index.css'
//import "taro-ui/dist/weapp/css/index.css"; #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性 需要显示声明
// connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props 这样才能完成类型检查和 IDE
// 的自动提示 使用函数模式则无此限制 ref:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  error: {
    list: any[]
  }
}

type PageDispatchProps = {
  fetchErrorBook: (id : string) => any
}

type PageOwnProps = {}

type PageState = {
  list?: any[];
  loading?: boolean;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props : IProps;
}

@connect(({error}) => ({error}), (dispatch) => ({
  fetchErrorBook(id) {
    dispatch(fetchErrorBook(id))
  }
}))
class Index extends Component < IProps,
PageState > {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config : Config = {
    navigationBarTitleText: '选择错题集'
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      list: undefined,
      loading: true
    }
  }

  componentWillReceiveProps(nextProps) {
    let {
      list = []
    } = nextProps.error;
    if (!this.state.list && list.length > 0) {
      this.setState({list, loading: false});
    }

  }
  componentDidMount() {
    let {id} = this.$router.params;
    this.setState({loading: true});
    this
      .props
      .fetchErrorBook(id);
  }
  componentWillUnmount() {
    this.setState({list: undefined, loading: true})
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let {id} = this.$router.params;
    let {
      list = [],
      loading
    } = this.state;

    return (
      <View className='book'>
        {loading && <View style="text-align:center;margin-top:20PX;">
          <View style="display:inline-block;">
            <AtActivityIndicator content='加载中...'></AtActivityIndicator>
          </View>
        </View>
}
        <View>
          {list.map(item => (
            <View key={id} class="paper_item">
              <Text>{id}、{item}</Text>
              <Button
                data-category={item}
                size="mini"
                className='item_btn'
                type='primary'
                onClick={this.enterPaperHandle}>查看错题</Button>
            </View>
          ))
}

          {0 === list.length && !loading && <AtDivider content='请先参加模拟考试' fontColor='#2d8cf0' lineColor='#2d8cf0'/>}
        </View>
      </View>
    )

  }

  private enterPaperHandle(e) {
    let {id} = this.$router.params;
    let category = e.target.dataset.category;
    Taro.navigateTo({
      url: "../error/index?id=" + id + "&category=" + category
    });
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性 这样在使用这个子类时 Ts 才不会提示缺少 JSX
// 类型参数错误
//
// #endregion

export default Index as ComponentClass < PageOwnProps,
PageState >
