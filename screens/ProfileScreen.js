import React from 'react';
import { Alert, View, Text, ScrollView, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import SessionStore from '../SessionStore';
import constants from '../constants';
import FastImage from 'react-native-fast-image';
import {getCategoryName} from './helpers/functions'
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import urls from '../URLS';

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        media : '',
        channel_data : {},
        loading : false,
    }

    componentDidMount() {
        const is_first_time = new SessionStore().getValue(constants.IS_FIRST_TIME);
        if(is_first_time){
            new SessionStore().putValue(constants.IS_FIRST_TIME, false);
            this.fetchChannel(); 
        } else {
            const user_data = new SessionStore().getValue(constants.USER_DATA);
            this.setData(user_data);
        }
    }

    setData = (user_data) =>{
        const media = user_data.media ? user_data.media[0] : 'x.png';
        channel_data = {
            _id : user_data.channel,
            name : user_data.name,
            description : user_data.description,
            followers : user_data.followers,
            media : urls.PREFIX + '/' + media,
            private : user_data.private,
            reactions : user_data.reactions,
            category : user_data.category,
            social_link  :user_data.social_link,
            streaks : user_data.streaks
        }
        this.setState({channel_data, loading : false});
    }

    fetchChannel = () =>{
        this.setState({loading : true});
        axios.post(urls.FETCH_CHANNEL_DATA, {}, {
            headers: {
            'x-access-token': new SessionStore().getValue(constants.TOKEN)
            }
        }).then((response) => {
            const responseObj = response.data;
            if (!responseObj.error) {
                const obj = responseObj.data[0];
                new SessionStore().putValue(constants.USER_DATA, obj);
                this.setData(obj);
            } else {
                console.log(responseObj);
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    openSocialLink = (url) =>{
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

    render() {
        const { channel_data, loading } = this.state;
        return(
            <View 
                style={{
                    flex: 1
                }}
            >
                <ScrollView 
                    style={{margin : 10, marginTop : 30, flex : 1}}
                    refreshControl = {
                        <RefreshControl 
                            refreshing = {loading}
                            onRefresh = {this.fetchChannel}
                        />
                    }
                >
                    <View style={{width : 130, height : 130, borderRadius : 100, padding : 10, backgroundColor : '#ddd', justifyContent : 'center', alignItems : 'center', alignSelf : 'center'}}>
                        <FastImage
                            style={{
                            width : 120,
                            height : 120,
                            backgroundColor : '#bbb',
                            borderRadius: 110,
                            }}
                            source={{uri : encodeURI(channel_data.media) === "undefined" ? 'https://mycampusdock.com/x.png' : encodeURI(channel_data.media) }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <Text style={{fontSize : 18, color : '#333', margin : 10, textAlign : 'center', flexDirection : 'row'}}>
                        { channel_data.name}
                    </Text>
                    <Text style={{fontSize : 14, color : '#999', marginTop : 0, margin : 10, textAlign : 'center', flexDirection : 'row'}}>
                        {'('}
                        {getCategoryName(channel_data.category)}
                        {')'}
                    </Text>

                    <View style={{flexDirection : 'row', justifyContent : 'center', marginTop : 10}}>
                        <View style={{justifyContent : 'center'}}>
                            <Icon2 name = {channel_data.private ? 'lock' : 'public'} size = {20} color = '#333' style={{alignSelf : 'center', margin : 5}}/>
                            <Text style={{fontSize : 13, color : '#333', textAlign : 'center'}}>{channel_data.private ? 'Private Channel' : 'Public Channel'}</Text>
                        </View>
                        <View style={{width : 2, height : '80%', backgroundColor : '#ddd', margin : 5, marginLeft : 10, marginRight : 10 }} />
                        <View style={{justifyContent : 'center'}}>
                            <Icon2 name = 'person' size = {20} color = '#333' style={{alignSelf : 'center', margin : 5,}}/>
                            <Text style={{fontSize : 13, color : '#333', textAlign : 'center'}}>{channel_data.followers + ' Subscribers '}</Text>
                        </View>
                        <View style={{width : 2, height : '80%', backgroundColor : '#ddd', margin : 5, marginLeft : 10, marginRight : 10}} />
                        <View style={{justifyContent : 'center'}}>
                            <Icon1 name = 'heartbeat' size = {20} color = '#333' style={{alignSelf : 'center', margin : 5}}/>
                            <Text style={{fontSize : 13, color : '#333', textAlign : 'center'}}>{channel_data.reactions + ' Reactions'}</Text>
                        </View>
                    </View>

                    <View>
                        <View style={{margin : 10, padding : 10, borderRadius :10, backgroundColor : '#ddd', marginTop : 15}}>
                            <Text style={{fontSize : 12, color : '#555', textAlign : 'center', marginTop : 0}}>
                                {'Description'}
                            </Text>

                            <Text selectable style={{fontSize : 15, color : '#444', textAlign : 'center', marginTop : 10, marginBottom : 10}}>
                                {channel_data.description}
                            </Text>

                           { channel_data.social_link !== undefined && channel_data.social_link.length > 0 &&
                            <View>
                                <Text style={{fontSize : 12, color : '#555', textAlign : 'center', marginTop : 15, marginBottom : 0}}>
                                    {'Social Link'}
                                </Text>

                                <TouchableOpacity activeOpacity = {0.7} onPress = {()=>this.openSocialLink(channel_data.social_link)}>
                                    <Text selectable numberOfLines = {1} lineBreakMode = 'tail' style={{fontSize : 15, color : '#444', textDecorationLine: 'underline', textAlign : 'center', marginTop : 10, marginBottom : 10, margin : 10}}>
                                        {channel_data.social_link}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                           }
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

}

export default ProfileScreen;