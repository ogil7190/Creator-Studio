import React from 'react';
import {View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import {getReaction} from '../screens/helpers/functions';

class ImageEditor extends React.Component {
    state = {
        imageURI : '',
        imageType : '',
        imageName : '',
        content_mode : FastImage.resizeMode.contain,
        reaction_type : getReaction(0)
    }

    openImagePicker = () =>{
        const options = {
            title: 'Pick an Image',
            noData: true,
            allowsEditing: true,
            storageOptions:{
                skipBackup:true,
                path:'images'
            }
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('CANCELED');
            } else if (response.error) {
                console.log('ERROR OCCURED');
            } else if (response.customButton) {
                console.log('CUSTOM ACTION');
            } else {
                this.setState({imageURI : response.uri, imageType : response.type, imageName : response.fileName});
            }
        });
    }

    exportData = () =>{
        const { imageURI, imageType, imageName, reaction_type, content_mode} = this.state;
        const empty = imageURI !== '' ? false : true;
        this.setState({imageURI : ''}, ()=>{
            this.resetReaction();
        });
        return {imageURI, imageType, imageName, reaction_type, type : 'Image', content_mode, empty};
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
            case FastImage.resizeMode.cover : return this.setState({content_mode : FastImage.resizeMode.contain});
            case FastImage.resizeMode.contain : return this.setState({content_mode : FastImage.resizeMode.cover});
            default : return this.setState({content_mode : FastImage.resizeMode.contain});
        }
    }

    render() {
        const {
            imageURI,
            reaction_type,
            content_mode
        } = this.state;
        return(
            <View style={{flex : 1, justifyContent : 'center'}}>
                {
                    imageURI === '' &&
                    <View style={{padding : 15, margin : 10, borderRadius : 10, backgroundColor : '#ddd', alignSelf : 'center'}}>
                        <TouchableOpacity style={{justifyContent : 'center', alignItems : 'center'}} onPress = {this.openImagePicker}> 
                            <Icon name = 'images' size = {50} color = '#fff' />
                            <Text style={{fontSize : 20, fontFamily : 'Roboto-Light', color : '#555'}}>Pick an Image</Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    imageURI !== '' &&
                    <View>
                        <FastImage 
                            source={{
                                uri: imageURI
                            }}
                            style={{
                                height : '100%',
                                width : '100%'
                            }}
                            resizeMode={content_mode}
                        >
                        <View style={{position : 'absolute', top : 10, left : 0, padding : 5, margin : 5, flexDirection : 'row'}}>
                            <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center',}} onPress = {()=>this.setState({imageURI : ''})}>
                                <View style={{width : 25, height : 25, borderRadius : 30, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                                    <Icon2 name = 'md-close-circle' size = {20} color = '#fff' />
                                </View>
                                <Text style={{color : '#fff', fontSize : 14}}>{'  Remove'}</Text>
                            </TouchableOpacity>
                            
                            <View style={{flex : 1}} />

                            <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onPress = {this.openImagePicker}>
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

                        </FastImage>
                    </View>
                }
            </View>
        );
    }
}

export default ImageEditor;