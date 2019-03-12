import React from 'react';
import {
  ActivityIndicator, 
  Dimensions, 
  View, 
  Text,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS
} from 'react-native';
import Video from 'react-native-video';
import urls from '../URLS';

const WIDTH = Dimensions.get('window').width;

class PostVideo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      buffering: false,
      progress : 0,
      hide : false,
    }
  }

  handleProgress = (details) =>{
    const progress = details.currentTime / details.seekableDuration;
    this.setState({progress});
  }

    render() {
      const {
        loading,
        buffering,
        hide
      } = this.state;
      const {
        message,
        video
      } = this.props;
      return (
        <View style={{
          backgroundColor: '#000',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        >
            <View>
              <Video
                source={{ uri: encodeURI(urls.PREFIX + '/' +  `${video}`) }}
                onLoad={() => this.setState({ loading: false })}
                onProgress = {(details)=>this.handleProgress(details)}
                onEnd = {()=>this.setState({hide : true})}
                // eslint-disable-next-line react/no-unused-state
                onBuffer={val => this.setState({ buffering: val.isBuffering })}
                style={{
                  width: WIDTH -5,
                  height: 300,
                  margin: 5,
                }}
              />
            <View style={{width : '100%', height : '100%', top : 0, left : 0, position : 'absolute', backgroundColor : hide ? 'rgba(0, 0, 0, 0.7)' : 'transparent'}}/>
            </View>

          <View style={{justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                left: 0,
                right: 0,
                bottom: 0,
                margin : 5,
                marginBottom : 10,
                marginTop : 2,
                backgroundColor : '#111',
                }}>
                {   
                    ( Platform.OS === 'android' )
                    ?
                        (
                            <ProgressBarAndroid
                              styleAttr = "Horizontal"
                              progress = { this.state.progress }
                              color = "#555"
                              indeterminate = { false }
                              style = {{ width: '100%' }}
                            />
                        )
                    :
                        (
                            <ProgressViewIOS
                              progressTintColor = "#555"
                              style = {{ width: '100%' }}
                              progress = { this.state.progress }
                            />
                        )
                }
            </View>

          <Text
            style={{
              color: '#aaa',
              marginTop : 20,
              marginLeft : 15, 
              marginRight : 15,
              fontFamily: 'Roboto',
              fontSize: 14,
              textAlign : 'center'
            }}
          >
            {message}
          </Text>
          {
            (loading || buffering)
              && (
                <ActivityIndicator size="small" color="#ddd" />
              )
          }
        </View>
      );
    }
}

export default PostVideo;
