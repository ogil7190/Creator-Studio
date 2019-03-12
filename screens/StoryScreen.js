import React from 'react';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import PostEditor from '../components/PostEditor';
import ImageEdior from '../components/ImageEditor';
import VideoEditor from '../components/VideoEditor';
import SessionStore from '../SessionStore';

class StoryScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        selected : 0,
    }
    
    render() {
        const {
            selected
        } = this.state;
        return(
            <ScrollView contentContainerStyle = {{flexGrow : 1, flex : 1}} style={{flex: 1}}>
                <View style = {{flex : 1, backgroundColor : '#333'}}>
                    {
                        selected === 0 && <PostEditor ref = {(active)=>new SessionStore().putValueTemp('active', active)} />
                    }

                    {
                        selected === 1 && <ImageEdior ref = {(active)=>new SessionStore().putValueTemp('active', active)} />
                    }

                    {
                        selected === 2 && <VideoEditor ref = {(active)=>new SessionStore().putValueTemp('active', active)} />
                    }
                </View>
                
                <View style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity style = {{margin : 10, padding : 10, backgroundColor : selected === 0 ? '#ddd' : '#efefef', borderRadius : 10}} onPress = {()=>this.setState({selected : 0})}>
                        <View style = {{marginLeft : 10, marginRight : 10, width : 45, height : 45, borderRadius : 45, backgroundColor : 'rgba(255, 0, 0, 0.5)', justifyContent : 'center', alignItems : 'center'}}>
                            <Icon name = 'text' size = {22} color = '#fff'/>
                        </View>
                        <Text style = {{color : '#333', fontSize : 15, textAlign : 'center', fontFamily : 'Roboto', margin : 5, marginBottom : 0}}>Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style = {{margin : 10, padding : 10, backgroundColor : selected === 1 ? '#ddd' : '#efefef', borderRadius : 10}} onPress = {()=>this.setState({selected : 1})}>
                        <View style = {{marginLeft : 10, marginRight : 10, width : 45, height : 45, borderRadius : 45, backgroundColor : 'rgba(0, 180, 0, 0.5)', justifyContent : 'center', alignItems : 'center'}}>
                            <Icon name = 'image' size = {22} color = '#fff'/>
                        </View>
                        <Text style = {{color : '#333', fontSize : 15, textAlign : 'center', fontFamily : 'Roboto', margin : 5, marginBottom : 0}}>Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style = {{margin : 10, padding : 10, backgroundColor : selected === 2 ? '#ddd' : '#efefef', borderRadius : 10}} onPress = {()=>this.setState({selected : 2})}>
                        <View style = {{marginLeft : 10, marginRight : 10, width : 45, height : 45, borderRadius : 45, backgroundColor : 'rgba(0, 0, 255, 0.5)', justifyContent : 'center', alignItems : 'center'}}>
                            <Icon name = 'video-camera' size = {22} color = '#fff'/>
                        </View>
                        <Text style = {{color : '#333', fontSize : 15, textAlign : 'center', fontFamily : 'Roboto', margin : 5, marginBottom : 0}}>Video</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

export default StoryScreen;