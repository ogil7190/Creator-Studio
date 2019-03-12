import React from 'react';
import {View} from 'react-native'
import Video from 'react-native-video';
import urls from '../URLS';

class VideoThumbnail extends React.Component {
    state = {
        videoURI : ''
    }

    componentDidMount(){
        if(this.props.frozen){
            let media = this.props.data.media;
            let url = urls.PREFIX + '/' + media;
            this.setState({videoURI : url});
        } else {
            this.setState({videoURI : this.props.data.videoURI});
        }
    }

    render() {
        const {videoURI} = this.state;
        console.log(videoURI);
        return(
            <View>
            {
                videoURI !== '' &&
                <Video
                    muted = {true}
                    repeat = {true}
                    source={{uri: encodeURI(videoURI)}}
                    style={{
                        width : 80,
                        height : 90,
                        backgroundColor : '#333'
                    }}
                    resizeMode = 'cover'
                />
            }
            </View>
        );
    }
}

export default VideoThumbnail;