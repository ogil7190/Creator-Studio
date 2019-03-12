import React from 'react';
import { Text, Dimensions, StatusBar, Platform, View, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PostThumbnail from '../components/PostThumbnail';
import ImageThumbnail from '../components/ImageThumbnail';
import VideoThumbnail from '../components/VideoThumbnail';
import { Navigation } from 'react-native-navigation';
import SessionStore from '../SessionStore';
import constants from '../constants';
import urls from '../URLS';
import axios from 'axios';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

const WIDTH = Dimensions.get('screen').width;

class SubmitStory extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        message : '',
        data : null,
        progress : 0,
        loading : false
    }

    getThumbnail = (data) =>{
        console.log(data);
        switch(data.type) {
            case 'Post' : return <PostThumbnail data = {data} />
            case 'Image' : return <ImageThumbnail data = {data} />
            case 'Video' : return <VideoThumbnail data = {data} />
        }
    }

    onUpdate = (data) =>{
        this.setState({data});
    }

    gotoScreen = (name) =>{
        Navigation.showModal({
          component: {
            name,
            passProps : {
                data : this.state.data,
                onUpdate : this.onUpdate
            },
            options: {
              topBar: {
                visible: false
              }
            }
          }
        });
      }

      getFormData = () =>{
          const formData = new FormData();
          let url;
          const data = this.props.data;
          const channel = new SessionStore().getValue(constants.USER_DATA)._id;

          switch(data.type){
            case 'Post' : 
                const config = {
                    type_font : data.type_font,
                    type_color : data.type_color
                }
                formData.append('config', JSON.stringify(config));
                formData.append('message', data.message);
                formData.append('reaction_type', JSON.stringify(data.reaction_type));
                url = urls.URL_CREATE_POST_STORY;
                if(this.state.data !== null) formData.append([this.state.data.type], this.state.data.value)
                break;
           
            case 'Image' :
                formData.append('message', this.state.message);
                formData.append('reaction_type', JSON.stringify(data.reaction_type));
                url = urls.URL_CREATE_IMAGE_STORY;
                if(this.state.data !== null) formData.append([this.state.data.type], this.state.data.value)
                formData.append("file", { 
                    uri: data.imageURI,
                    type: data.imageType,
                    name: channel + '_' + data.imageName
                });
                break;
            
            case 'Video' :
                formData.append('message', this.state.message);
                formData.append('reaction_type', JSON.stringify(data.reaction_type));
                url = urls.URL_CREATE_VIDEO_STORY;
                if(this.state.data !== null) formData.append([this.state.data.type], this.state.data.value)
                formData.append("file", {
                    uri: data.videoURI,
                    type: "video/mp4",
                    name: channel + '.mp4'
                });
                break;
          };
          return {formData, url};
      }

      handleSubmit = () =>{
        if(this.state.loading) return;
        this.setState({loading : true});

        const obj = this.getFormData();
        const context = this;
        const token = new SessionStore().getValue(constants.TOKEN);
        
        axios.post(obj.url, obj.formData, {
            onUploadProgress: function(progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                context.setState({ progress: percentCompleted });
            },
            headers: {
                'x-access-token': token
                }
            })
            .then((result) => {
                console.log(result);
                this.setState({loading : false});
                if(!result.data.error){
                    Navigation.dismissModal(this.props.componentId);
                    Alert.alert("Story Created Succesfully", 'You can see the analytics on home screen');
                }
            })
            .catch((err)=>{
                console.log(err);
                this.setState({loading : false});
            });
      }

    render() {
        const data = this.props.data;
        const {
            message, progress, loading
        } = this.state;
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>
                <View style={{flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity onPress = {()=>Navigation.dismissModal(this.props.componentId)}>
                        <Icon name = 'ios-arrow-round-back' size = {30} style={{margin : 5, width : 50}} />
                    </TouchableOpacity>
                    
                    <View style={{flex : 1}}/>

                    <Text style={{fontSize : 16, textAlign : 'center', fontFamily : 'Roboto-Light'}}>New Story</Text>
                    
                    <View style={{flex : 1}}/>
                    
                    <TouchableOpacity onPress={this.handleSubmit}>
                        <Text style={{fontSize : 15, textAlign : 'center', margin : 5, width : 50, color : 'green'}}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <View style={{backgroundColor : '#efefefbb', flexDirection : 'row', padding : 3}}>
                    {
                        this.getThumbnail(data)
                    }
                    <TextInput 
                        maxLength = {200}
                        multiline = {true}
                        editable = {data.type === 'Post' ? false : true}
                        style={{flex : 1,  paddingTop : 15, color : '#333', marginLeft : 5}}
                        keyboardAppearance = 'light' 
                        keyboardType = 'twitter'
                        autoCapitalize = 'none'
                        placeholder = 'Write a caption... optional'
                        value = {data.type === 'Post' ? data.message : message}
                        onChangeText = {val=>this.setState({message : val})}
                        placeholderTextColor = '#555'
                    />
                </View>
                
                <View style={{flex : 1, backgroundColor : '#efefefbb'}}>
                    <View style={{height : 0.5, backgroundColor : '#bbb', flexDirection : 'row'}}/>

                    <TouchableOpacity style={{padding : 5, flexDirection : 'row'}} onPress = {()=>this.gotoScreen('Add HashTag Screen')}>
                        <Text style={{fontSize : 15, margin : 5, marginLeft : 10, fontFamily : 'Roboto-Light'}}>Add a HashTag</Text>
                        <View style={{flex : 1}}/>
                        <Icon name = 'ios-arrow-round-forward' size = {25}/>
                    </TouchableOpacity>

                    <View style={{height : 1, backgroundColor : '#bbb', flexDirection : 'row'}}/>

                    <TouchableOpacity style={{padding : 5, flexDirection : 'row'}} onPress = {()=>this.gotoScreen('Share Link Screen')}>
                        <Text style={{fontSize : 15, margin : 5, marginLeft : 10, fontFamily : 'Roboto-Light'}}>Share a link</Text>
                        <View style={{flex : 1}}/>
                        <Icon name = 'ios-arrow-round-forward' size = {25}/>
                    </TouchableOpacity>

                    <View style={{height : 1, backgroundColor : '#bbb', flexDirection : 'row'}}/>

                    <TouchableOpacity style={{padding : 5, flexDirection : 'row'}} onPress = {()=>this.gotoScreen('Promote Event Screen')}> 
                        <Text style={{fontSize : 15, margin : 5, marginLeft : 10, fontFamily : 'Roboto-Light'}}>Promote an event</Text>
                        <View style={{flex : 1}}/>
                        <Icon name = 'ios-arrow-round-forward' size = {25}/>
                    </TouchableOpacity>

                    <View style={{height : 1, backgroundColor : '#bbb', flexDirection : 'row'}}/>

                    <Text style={{fontSize : 12, color : '#555', margin : 5, marginLeft : 10, marginTop : 10}}>
                    {
                        'You can add one of the above action, user can act directly from the stories. Shared links will be opened in app browser and must not contain the abusive content.'
                    }
                    </Text>
                    <View style={{justifyContent : 'center', alignItems : 'center'}}>
                        { progress > 0 && 
                            <ProgressBarAnimated
                                width={WIDTH}
                                borderRadius = {0}
                                borderWidth = {0}
                                height = {3}
                                barEasing = 'bounce'
                                value={progress}
                                backgroundColorOnComplete="green"
                            />
                        }
                        {
                            loading &&
                            <ActivityIndicator size = 'small' color = '#514A9D' style={{margin : 10}} />
                        }
                    </View>
                </View>
            </View>
        );
    }
}

export default SubmitStory;