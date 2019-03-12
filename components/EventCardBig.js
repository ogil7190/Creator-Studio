import React from 'react';
import {
  View, TouchableOpacity, Text
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import urls from '../URLS';
import axios from 'axios';
import {getMonthName} from '../screens/helpers/functions'
import SessionStore from '../SessionStore';
import constants from '../constants';
import Realm from '../realm';

class EventCardBig extends React.Component {
  constructor(props){
    super(props);
  }

  state = {
    item : {media : '["xxx"]', date : new Date()}
  }

  componentDidMount(){
    this.setState({item : this.props.item});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps !== this.props){
      this.fetch_event(this.props.item._id);
    }
  }

  fetch_event = (_id) =>{
    axios.post(urls.FETCH_EVENT_DATA, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(constants.TOKEN)
      }
    }).then((response) => {
      const responseObj = response.data;
      if (!responseObj.error) {
        Realm.getRealm((realm) => {
          const el = responseObj.data[0];
          realm.write(() => {
            el.reach = JSON.stringify(el.reach);
            el.views = JSON.stringify(el.views);
            el.enrollees = JSON.stringify(el.enrollees);
            el.enrollees_size = JSON.stringify(el.enrollees_size);
            el.interested = JSON.stringify(el.interested);
            el.audience = JSON.stringify(el.audience);
            el.media = JSON.stringify(el.media);
            el.timestamp = new Date(el.timestamp);
            el.time = new Date(el.time);
            el.ms = Date.parse(''+el.date);
            el.date = new Date(el.date);
            try {
              realm.create('Events', el, true);
              this.setState({item : el});
            } catch (e) {
              console.log(e);
            }
          });
        });
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  render(){
  const {onPress, width, height} = this.props;
  const {media, channel_name, title, location, views, enrollees_size, interested, date} = this.state.item;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => {
        onPress(this.state.item);
      }}
      elevation={5}
      style={{
        overflow: 'hidden',
        width,
        height,
        backgroundColor: '#111',
        shadowColor: '#000',
        margin: 10,
        borderRadius: 10,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {
          height: 2,
          width: 2
        }
      }}
    >
      <FastImage
        style={{
          width,
          height,
          borderRadius: 10,
          position: 'absolute'
        }}
        source={{ uri: urls.PREFIX + '/' + JSON.parse(media)[0] }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <LinearGradient
        style={{
          position: 'absolute',
          width,
          height,
          opacity: 1,
          flex: 1,
          justifyContent : 'center',
          alignItems : 'center'
        }}
        colors={['#11111177', '#000000cc']}
      >
        <View style={{margin : 10, flexDirection : 'row'}}>
            <View style={{backgroundColor : 'rgba(200, 200, 200, 0.3)', justifyContent : 'center', alignItems : 'center', width : 70, height : 70, borderRadius : 70, marginLeft : 10, marginRight : 10}}>
                <Icon name = 'eyeo' size = {28} color = '#ddd' />
                <Text style={{fontSize : 18, color : '#fff', textAlign : 'center'}}>
                  {views}
                </Text>
            </View>

            <View style={{backgroundColor : 'rgba(200, 200, 200, 0.3)', justifyContent : 'center', alignItems : 'center', width : 70, height : 70, borderRadius : 70, marginLeft : 10, marginRight : 10}}>
                <Icon name = 'hearto' size = {28} color = '#ddd' />
                <Text style={{fontSize : 18, color : '#fff', textAlign : 'center'}}>
                  {interested}
                </Text>
            </View>

            <View style={{backgroundColor : 'rgba(200, 200, 200, 0.3)', justifyContent : 'center', alignItems : 'center', width : 70, height : 70, borderRadius : 70, marginLeft : 10, marginRight : 10}}>
                <Icon name = 'user' size = {28} color = '#ddd' />
                <Text style={{fontSize : 18, color : '#fff', textAlign : 'center'}}>
                  {enrollees_size}
                </Text>
            </View>
        </View>
      </LinearGradient>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Roboto-Light',
          fontSize: 12,
          left: 15,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          top: 15,
          color: '#dfdfdf'
        }}
      >
        {channel_name}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Roboto',
          fontSize: 22,
          left: 15,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          top: 40,
          color: '#efefef'
        }}
      >
        {title}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Roboto-Light',
          fontSize: 15,
          left: 15,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          bottom: 20,
          color: '#dfdfdf'
        }}
      >
        {location}
        {' '}
        {' • '}
        {' '}
        {getMonthName(date.getMonth() + 1) }
        {' '}
        {JSON.stringify(date.getDate())}
      </Text>
    </TouchableOpacity>
  );
  }
}

export default EventCardBig;
