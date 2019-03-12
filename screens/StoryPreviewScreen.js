/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
  StatusBar,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  View,
  Text
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Post from '../components/Post';
import Realm from '../realm';
import {processRealmObj, objArrayToArray} from './helpers/functions';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';
import IconIon from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/FontAwesome';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class StoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY();
    this.opacity = new Animated.Value(1);
    this.topHeight = new Animated.Value(HEIGHT);

    // eslint-disable-next-line no-underscore-dangle
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
      },
      onPanResponderMove: (evt, gestureState) => {
        const {
          pan
        } = this.state;
        if (gestureState.dy > 0) {
          this.opacity.setValue(1 - gestureState.dy / HEIGHT);
          pan.setValue({ y: gestureState.dy });
        }
        return true;
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (((gestureState.dy / HEIGHT) * 100) > 30) {
          this.closeWithAnimation();
        } else {
          const {
            pan
          } = this.state;
          Animated.parallel([
            Animated.spring(pan, {
              toValue: 0,
              friction: 10
            }),
            Animated.timing(this.opacity, {
              toValue: 1,
              duration: 200
            })
          ]).start();
        }
        const {
          current,
          stories
        } = this.state;
        if (gestureState.x0 > 0 && gestureState.x0 < WIDTH / 3) {
          if (current === stories.length - 1) console.log('DO NOTHING')
          else this.setState({ current: current + 1 });
        } else if (gestureState.x0 > (WIDTH * 2) / 3) {
          if (current === 0)this.close();
          else this.setState({ current: current - 1 });
        // eslint-disable-next-line no-sequences
        } else if (gestureState.dx < 5, gestureState.dy < 5) {
          this.tapped();
        }
      },
      onShouldBlockNativeResponder: () => true,
    });
  }

  state = {
    stories: [],
    archives : [],
    current: 0,
    loading: true,
    pan: new Animated.ValueXY()
  }

  closeWithAnimation = () =>{
    const {
      componentId
    } = this.props;
    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: HEIGHT + this.topHeight._value,
        duration: 200,
        friction: 7
      }),
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 200
      })
    ]).start();
    setTimeout(() => Navigation.dismissOverlay(componentId), 180);
  }

  componentDidMount() {
    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: 0,
        friction: 10
      }),
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 200
      })
    ]).start(() => {
      Realm.getRealm((realm)=>{
        const archives = realm.objects('Archive').filtered(`type="${'story'}"`).sorted('timestamp', true);
        processRealmObj(archives, (result)=>{
            objArrayToArray('_id', result, (response)=>{
              this.setState({stories : this.props.stories, archives : response, loading : false});
            });
        });
      });
    });
  }

  tapped = () => {
    /* next story */
    const {current} = this.state;
    if (current === 0)this.close();
    else this.setState({ current: current - 1 });
  }

  close = () => {
    const {
      componentId
    } = this.props;
    Navigation.dismissOverlay(componentId);
  }

  handleArchive = (isArchived) =>{
    if(isArchived) return;
    const {
      stories,
      archives,
      current,
    } = this.state;
    try{
      Realm.getRealm((realm)=>{
        realm.write(() => {
          realm.create('Archive', { '_id' : stories[current]._id, 'type' : 'story', timestamp : new Date()}, true);
        });
      });
      archives.push(stories[current]._id);
      this.setState({archives});
    } catch(e){
      console.log(e);
    }
  }

  render() {
    const {
      loading,
      stories,
      archives,
      current,
      pan
    } = this.state;
    const [translateY] = [pan.y];
    const isArchived =  stories[current] ? archives.indexOf(stories[current]._id) !== -1 : false;
    console.log('CUR', stories[current]);
    return (
      <Animated.View
        style={{
          top: this.topHeight,
          width: WIDTH,
          height: HEIGHT,
          borderRadius: this.radius,
          overflow: 'hidden',
          justifyContent: 'center',
          opacity: this.opacity,
          backgroundColor: '#000000',
          transform: [{ translateY }]
        }}
      >
        <StatusBar hidden />
        {
          loading
          && <ActivityIndicator size="small" color="#fff" />
        }
        {
            !loading && stories.length === 0
            && (
            <View>
              <Text style={{ textAlign: 'center', color: '#fff' }}> Sorry there are no new stories yet! </Text>
            </View>
            )
        }
        {
          stories.length > 0
          && stories[current] !== undefined
          && stories[current].type === 'post'
          && <Post thumb={false} key={stories[current]._id} data={stories[current]} />
        }
        {
          stories.length > 0
          && stories[current] !== undefined
          && stories[current].type === 'post-image' && (
          <PostImage
            key={stories[current]._id}
            message={stories[current].message}
            image={JSON.parse(stories[current].media)[0]}
          />
          )
        }
        {
          stories.length > 0
          && stories[current] !== undefined
          && stories[current].type === 'post-video'
            && (
              <PostVideo
                key={stories[current]._id}
                message={stories[current].message}
                video={stories[current].media}
              />
            )
        }

        <View
          style={{
            flex: 1,
            height: HEIGHT,
            width: WIDTH,
            top: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            position: 'absolute'
          }}
        >
          <View
            collapsable={false}
            style={{
              width: WIDTH,
            }}
            {...this._panResponder.panHandlers}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            top: 18,
            left: 0,
            width: '100%'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 12, marginTop: 5 }} activeOpacity = {isArchived ? 0.95 : 0.5} onPress={()=>this.handleArchive(isArchived)}>
              <View style={{width : 35, height : 35, backgroundColor : '#rgba(255, 255, 255, 0.3)', borderRadius : 30 , padding : 5, justifyContent: 'center', alignItems: 'center',}}>
                <IconIon name = 'md-archive' size = {20} color = '#ddd' />
              </View>
              {
                isArchived &&
                <Text style={{fontSize : 12, margin : 5, color : '#fff', marginLeft : 10}}>Archived</Text>
              }
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View
              style={{
                justifyContent: 'center',
                textAlign: 'right',
                padding: 4,
                paddingLeft : 8,
                paddingRight : 8,
                marginRight: 12,
                backgroundColor: '#ffffff99',
                borderRadius: 20
              }}
            >
              <Text
                style={{
                  fontFamily: 'Roboto',
                  alignSelf: 'center',
                  fontSize: 15,
                  color: '#222'
                }}
              >
                {this.state.stories.length - this.state.current}/{this.state.stories.length}
              </Text>
            </View>
          </View>
        </View>
      {
          stories[current] !== undefined &&
          <View 
            style={{
              position : 'absolute',
              bottom : 10, 
              alignSelf : 'center', 
              padding : 15, 
              paddingRight : 50, 
              paddingLeft : 50, 
              justifyContent : 'center', 
              alignItems : 'center'
            }}
            >
            <Text style={{color : '#fff', fontSize : 14, margin : 5}}>{' '  + stories[current].reactions}</Text>
            <View style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center',}}>
                <View style={{width : 40, height : 40, borderRadius : 40, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                    <Text style={{fontSize : 30, textAlign : 'center',}}>{JSON.parse(stories[current].reaction_type).value}</Text>
                </View>
            </View>
          </View>
      }
      {stories[current] !== undefined && 
        <View style={{position : 'absolute', bottom : 15, left : 10, padding : 5, margin : 5, alignItems : 'center'}}>
            <Text style = {{color : '#fff', fontSize : 14, textAlign : 'center', margin : 5}}>
              {stories[current].story_views}
            </Text>
            <View style={{width : 40, height : 40, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center', borderRadius : 30}}>
              <IconIon name = 'md-eye' color = '#fff' size = {25} style={{alignSelf : 'center'}} />
            </View>
        <View style={{flex : 1}} />
    </View>
      }

        {stories[current] !== undefined && 
        <View style={{position : 'absolute', bottom : 15, right : 10, padding : 5, margin : 5, alignItems : 'center'}}>
            <Text style = {{color : '#fff', fontSize : 14, textAlign : 'center', margin : 5}}>
              {stories[current].channel_visits}
            </Text>
            <View style={{width : 40, height : 40, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center', borderRadius : 30}}>
              <Icon3 name = 'share' color = '#fff' size = {22} style={{alignSelf : 'center'}} />
            </View>
        <View style={{flex : 1}} />
    </View>
      }
      </Animated.View>
    );
  }
}

export default StoryScreen;
