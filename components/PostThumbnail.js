import React from 'react';
import {Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class PostThumbnail extends React.Component {
    state = {
        message : '',
        type_color : 1,
        type_font : 'Regular'
    }

    getColors = (type) =>{
        let arr = [];
        switch(type){
            case 1 : arr =  ['#0056e5', '#85f5ff']; break;
            case 2 : arr = ['#232526', '#414345'];break;
            case 3 : arr = ['#f12711', '#f5af19'];break;
            default : arr = ['#0056e5', '#85f5ff'];break;
        }
        return arr;
    }

    componentDidMount(){
        if(this.props.frozen){
            const data = this.props.data;
            const config = JSON.parse(data.config);
            this.setState({ message : data.message, type_color : config.type_color, type_font : config.type_font});
        } else {
            const data = this.props.data;;
            this.setState({ message : data.message, type_color : data.type_color, type_font : data.type_font});
        }
    }

    render() {
        const { type_font, type_color, message} = this.state;
        return(
            <LinearGradient style={{width : 80, height : 90, margin : 10, justifyContent :'center', alignItems : 'center'}} colors = {this.getColors(type_color)}>
                <Text style={{color : '#fff', fontSize : 8, fontFamily : 'Roboto-' + type_font, textAlign : 'center'}} lineBreakMode = 'tail' numberOfLines={4}>
                    {message}
                </Text>
            </LinearGradient>
        );
    }
}

export default PostThumbnail;