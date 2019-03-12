import React from 'react';
import { Platform, Alert, View, StatusBar, TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import urls from '../URLS';
import axios from 'axios';
import SessionStore from '../SessionStore';
import constants from '../constants';

class UpdateChannelScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        social_link : '',
        description : '',
        loading : false,
        changed : false
    }

    componentDidMount = () =>{
        const user_data = new SessionStore().getValue(constants.USER_DATA);
        const description = user_data.description;
        const social_link = user_data.social_link ? user_data.social_link : '' ;
        this.setState({description, social_link});
    }

    handleDone = () =>{
        const { loading, changed, social_link, description} = this.state;
        if(loading) return;
        if(!changed) return Alert.alert('Please update something');
        if(description.length > 10){
            if(social_link.length > 0){
                const re = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
                if(re.test(social_link)){
                    this.updateChannel(description.trim(), social_link.trim());
                } else {
                    Alert.alert('Put valid data', 'Social URL is not a valid url');
                }
            } else this.updateChannel(description.trim(), social_link.trim());
        } else {
            Alert.alert('Put valid data', 'Please provide a good description, its mandatory for a channel.');
        }
    }

    updateChannel = (description, social_link) =>{
        this.setState({loading : true});
        axios.post(urls.URL_UPDATE_CHANNEL, {description, social_link}, {
            headers: {
                'x-access-token': new SessionStore().getValue(constants.TOKEN)
            }
        }).then(response => {
            if(!response.data.error){
                Navigation.dismissModal(this.props.componentId);
                Alert.alert('Sucessfully updated channel');
            } else {
                Alert.alert('Something Went wrong', 'Please Try again later.');
            }
        }).catch((err)=>{
            console.log(err);
        });
    }

    render() {
        const { social_link, description} = this.state;
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>
                <View style={{flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity onPress = {()=>Navigation.dismissModal(this.props.componentId)}>
                        <Icon name = 'ios-arrow-round-back' size = {30} style={{margin : 5, width : 50}} />
                    </TouchableOpacity>
                    
                    <View style={{flex : 1}}/>

                    <Text style={{fontSize : 16, textAlign : 'center', fontFamily : 'Roboto-Light'}}>Update Channel</Text>
                    
                    <View style={{flex : 1}}/>
                    
                    <TouchableOpacity onPress={this.handleDone}>
                        <Text style={{fontSize : 15, textAlign : 'center', margin : 5, width : 50, color : 'blue'}}>Done</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex : 1, backgroundColor : '#efefef'}}>
                    <View style={{margin : 10}}>
                        <TextInput 
                            multiline = {true}
                            maxLength = {250}
                            placeholder = 'Write About Your Channel'
                            placeholderTextColor = '#555'
                            style = {{backgroundColor : '#ddd', borderRadius : 10, padding : 5, minHeight : 150, textAlign : "center", color : "#333", fontSize : 15 }}
                            value = {description}
                            onChangeText = {val=>this.setState({description : val, changed : true})}
                        />
                        <Text style={{fontSize : 12, color : '#555', marginTop : 10, margin : 5}}>
                            {
                                'Use good words, keep it simple & short, & describe about the content you are going to share here.'
                            }
                        </Text>
                        <View style={{flex : 1, marginTop : 20}} />
                        <TextInput 
                            placeholder = 'Your Social Plugin Link'
                            placeholderTextColor = '#555'
                            style = {{backgroundColor : '#ddd', borderRadius : 10, padding : 10, textAlign : "center", color : "#333", fontSize : 15 }}
                            value = {social_link}
                            onChangeText = {val=>this.setState({social_link : val, changed : true})}
                        />
                        <Text style={{fontSize : 12, color : '#555', marginTop : 10, margin : 5}}>
                            {
                                'Use social plugins to know the users about you, promote  yourself & gain more audience.'
                            }
                        </Text>
                    </View>
                    
                    {
                        this.state.loading &&
                        <ActivityIndicator color = '#333' size = 'small' style = {{margin : 5}} />
                    }
                </View>
            </View>
        );
    }
}

export default UpdateChannelScreen;