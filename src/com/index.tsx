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

export class Welcome extends Component {
    render () {
      return <View><Text>Hello, {this.props.name}</Text></View>
    }
  }

  Welcome.propTypes = {
    name: PropTypes.string
  };