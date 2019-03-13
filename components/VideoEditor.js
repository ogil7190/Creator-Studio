import React from 'react';
import {Platform, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import { Navigation } from 'react-native-navigation';
import constants from '../constants';
import {getReaction} from '../screens/helpers/functions';

const VIDEO_LENGTH_LIMIT = constants.VIDEO_LENGTH_LIMIT;

class VideoEditor extends React.Component {
    state = {
        videoURI : '',
        content_mode : 'contain',
        reaction_type : getReaction(0)
    }

    openVideoPicker = () =>{
        const options = {
            title: 'Pick a Video Clip',
            videoQuality: Platform.OS === 'ios' ? 'medium' : 'high',
            allowsEditing: true,
            durationLimit: VIDEO_LENGTH_LIMIT,
            mediaType: 'video',
            storageOptions:{
                skipBackup:true,
                path:'images'
            }
        }
        
        if (Platform.OS === "android") {
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('CANCELED');
                } else if (response.error) {
                    console.log('ERROR OCCURED');
                } else if (response.customButton) {
                    console.log('CUSTOM ACTION');
                } else {
                    this.setState({videoURI : ''}, () => {
                        Navigation.showModal({
                            stack: {
                              children: [{
                                component: {
                                  name: 'Video Modal Screen',
                                  passProps: {
                                    uri: response.uri,
                                    completedEditing: this.completedEditing
                                  },
                                  options: {
                                    topBar: {
                                      visible: false,
                                      drawBehind: true
                                    }
                                  }
                                }
                              }]
                            }
                        });
                    });
                }
            });
        } else {
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('CANCELED');
                } else if (response.error) {
                    console.log('ERROR OCCURED');
                } else if (response.customButton) {
                    console.log('CUSTOM ACTION');
                } else {
                    this.setState({videoURI : response.uri});
                }
            });
        }
    }

    completedEditing = (err, data) => {
        if (err) return;
        this.setState({videoURI: data});
    }

    resetReaction = ()=>{
        this.setState({reaction_type : getReaction(0)});
    }

    changeReaction = () =>{
        const {reaction_type}  = this.state;
        this.setState({reaction_type : getReaction(reaction_type.type)});
    }

    changeContentMode = () =>{
        switch(this.state.content_mode){
            case 'cover' : return this.setState({content_mode : 'contain'});
            case 'contain' : return this.setState({content_mode : 'cover'});
            default : return this.setState({content_mode : 'contain'});
        }
    }

    exportData = () =>{
        const { videoURI, reaction_type, content_mode } = this.state;
        const empty = videoURI !== '' ? false : true;
        this.setState({videoURI : ''}, ()=>{
            this.resetReaction();
        });
        return {videoURI, type : 'Video', reaction_type, content_mode, empty};
    }

    render() {
        const {
            videoURI, reaction_type, content_mode
        } = this.state;
        return(
            <View style={{flex : 1, justifyContent : 'center'}}>
                {
                    videoURI === '' &&
                    <View style={{padding : 15, margin : 10, borderRadius : 10, backgroundColor : '#ddd', alignSelf : 'center'}}>
                        <TouchableOpacity style={{justifyContent : 'center', alignItems : 'center'}} onPress = {this.openVideoPicker}> 
                            <Icon name = 'video' size = {50} color = '#fff' />
                            <Text style={{fontSize : 20, fontFamily : 'Roboto-Light', color : '#555'}}>Pick a Video Clip</Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    videoURI !== '' &&
                    <View>
                        <Video
                            repeat = {true}
                            source={{ uri: "file://" + videoURI }}
                            style={{
                                height : '100%',
                                width : '100%'
                            }}
                            resizeMode = {content_mode}
                        />
                        <View style={{position : 'absolute', top : 10, left : 0, padding : 5, margin : 5, flexDirection : 'row'}}>
                            <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center',}} onPress = {()=>this.setState({videoURI : ''})}>
                                <View style={{width : 25, height : 25, borderRadius : 30, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                                    <Icon2 name = 'md-close-circle' size = {20} color = '#fff' />
                                </View>
                                <Text style={{color : '#fff', fontSize : 14}}>{'  Remove'}</Text>
                            </TouchableOpacity>
                            
                            <View style={{flex : 1}} />

                            <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onPress = {this.openVideoPicker}>
                                <Text style={{color : '#fff', fontSize : 14}}>{'Change  '}</Text>
                                <View style={{width : 25, height : 25, borderRadius : 30, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                                    <Icon2 name = 'md-refresh-circle' size = {20} color = '#fff' />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{position : 'absolute', bottom : 10, left : 0, padding : 5, margin : 5, flexDirection : 'row'}}>
                            <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center',}} onPress = {this.changeReaction}>
                                <View style={{width : 40, height : 40, borderRadius : 40, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style={{fontSize : 30, textAlign : 'center',}}>{reaction_type.value}</Text>
                                </View>
                                <Text style={{color : '#fff', fontSize : 14}}>{' '  + reaction_type.name}</Text>
                            </TouchableOpacity>
                            
                            <View style={{flex : 1}} />

                            <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onPress = {this.changeContentMode}>
                                <Text style={{color : '#fff', fontSize : 14}}>{'Change Mode  '}</Text>
                                <View style={{width : 25, height : 25, borderRadius : 30, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                                    <Icon3 name = 'crop' size = {20} color = '#fff' />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        );
    }
}

export default VideoEditor;