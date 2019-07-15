import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text, Progress} from '@tarojs/components'
import {connect} from '@tarojs/redux'

import {asyncFetchPapers} from '../../actions/book'

import './index.css'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性 需要显示声明
// connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props 这样才能完成类型检查和 IDE
// 的自动提示 使用函数模式则无此限制 ref:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  book: {
    list: any[]
  }
}

type PageDispatchProps = {
  fetch: () => any
}

type PageOwnProps = {}

type PageState = {
  list?: any[];
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props : IProps;
}

@connect(({book}) => ({book}), (dispatch) => ({
  fetch() {
    dispatch(asyncFetchPapers())
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
    navigationBarTitleText: '选择试题'
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      list: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
    let {
      list = []
    } = nextProps.book;
    if (list.length > 0) {
      this.setState({list});
    }

  }
  componentDidMount() {
    this
      .props
      .fetch();
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let {
      list = []
    } = this.state;

    return (
      <View className='index'>
        <View>
          {list.map(item => (
            <View key={item.id} class="paper_item">
            <Text>{item.id}、{item.name}</Text>
            <Button data-num={item.id} size="mini" className='item_btn' type='primary' onClick={this.enterPaperHandle}>开始答题</Button>
            </View>
          ))
}
        </View>
      </View>
    )

  }

  private enterPaperHandle(e) {
    let num = e.target.dataset.num;
    Taro.navigateTo({
      url: "../paper/index?id=" + num
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
