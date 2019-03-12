import React from 'react';
import { Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import urls from '../URLS';


class ImageThumbnail extends React.Component {
    state = {
        imageURI : ''
    }

    componentDidMount(){
        if(this.props.frozen){
            let media = JSON.parse(this.props.data.media);
            this.setState({imageURI : urls.PREFIX + '/' + media[0]});
        } else {
            this.setState({imageURI : this.props.data.imageURI});
        }
    }
    
    render() {
        const { imageURI } = this.state;
        return(
            <FastImage 
                source={{
                    uri: encodeURI(imageURI)
                }}
                style={{
                    width : 80,
                    height : 90,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        );
    }
}

export default ImageThumbnail;