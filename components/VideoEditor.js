import React from 'react';
import { RNFetchBlob, Alert, NativeModules, View, TouchableOpacity, Platform, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import { Navigation } from 'react-native-navigation';
import constants from '../constants';

const VIDEO_LENGTH_LIMIT = constants.VIDEO_LENGTH_LIMIT;

class VideoEditor extends React.Component {
    state = {
        videoURI : '',
        reaction_type : { name : 'Clap', value : '👏', type : 1}
    }

    openVideoPicker = () =>{
        
        const options = {
            title: 'Pick a Video Clip',
            videoQuality: 'high',
            allowsEditing: true,
            durationLimit: VIDEO_LENGTH_LIMIT,
            mediaType: 'video',
            storageOptions:{
                skipBackup:true,
                path:'images'
            }
        }
        
        if (Platform.OS === "android") {
            // NativeModules.MkaerVideoPicker.openPicker()
            //     .then((data) => {
            //         data = JSON.parse(data);
            //         console.log(data);
            //         Navigation.showModal({
            //             stack: {
            //               children: [{
            //                 component: {
            //                   name: 'Video Modal Screen',
            //                   passProps: {
            //                     uri: data.uri,
            //                     completedEditing: this.completedEditing
            //                   },
            //                   options: {
            //                     topBar: {
            //                       visible: false,
            //                       drawBehind: true
            //                     }
            //                   }
            //                 }
            //               }]
            //             }
            //         });
            //     })
            //     .catch(err => {
            //         Alert.alert(JSON.stringify(err));
            //     })

            ImagePicker.launchImageLibrary(options, (response) => {
                // Alert.alert(JSON.stringify(response));
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
        this.setState({reaction_type : { name : 'Clap', value : '👏', type : 1}});
    }

    changeReaction = () =>{
        const {reaction_type}  = this.state;
        switch(reaction_type.type){
            case 6 : return this.setState({reaction_type : { name : 'Clap', value : '👏', type : 1}});
            case 1 : return this.setState({reaction_type : { name : 'Superb', value : '👌', type : 2}});
            case 2 : return this.setState({reaction_type : { name : 'Love', value : '😍', type : 3}});
            case 3 : return this.setState({reaction_type : { name : 'Hot', value : '🔥', type : 4}});
            case 4 : return this.setState({reaction_type : { name : 'Haha', value : '😂', type : 5}});
            case 5 : return this.setState({reaction_type : { name : 'Yummy', value : '😋', type : 6}});
            default : return this.setState({reaction_type : { name : 'Clap', value : '👏', type : 1}});
        }
    }

    exportData = () =>{
        const { videoURI, reaction_type } = this.state;
        const empty = videoURI !== '' ? false : true;
        this.setState({videoURI : ''}, ()=>{
            this.resetReaction();
        });
        return {videoURI, type : 'Video', reaction_type, empty};
    }

    render() {
        const {
            videoURI, reaction_type
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

                            <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onPress = {this.resetReaction}>
                                <Text style={{color : '#fff', fontSize : 14}}>{'Reset Reaction  '}</Text>
                                <View style={{width : 25, height : 25, borderRadius : 30, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                                    <Icon3 name = 'replay' size = {20} color = '#fff' />
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