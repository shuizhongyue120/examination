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
  import PropTypes from 'prop-types';
  import {IQuestionItem, colorGradeMap} from "../constants/paper"

export class ChooseList extends Component {
    render () {
      return <View><Text>Hello, {this.props.item}</Text></View>
    }
  }

  ChooseList.propTypes = {
    item: PropTypes.any
  };