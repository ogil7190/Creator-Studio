import React from 'react';
import {View, ScrollView, Text, RefreshControl, Alert, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation'
import Realm from '../realm';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Ionicons';
import SessionStore from '../SessionStore';
import {processRealmObj, timelapse} from './helpers/functions';
import constants from '../constants';
import urls from '../URLS';
import PostThumbnail from '../components/PostThumbnail';
import ImageThumbnail from '../components/ImageThumbnail';
import VideoThumbnail from '../components/VideoThumbnail';
import EventCardBig from '../components/EventCardBig';
import InformationCard from '../components/InformationCard';

const STORY_THRESHOLD = constants.STORY_THRESHOLD;
const WIDTH = Dimensions.get('window').width;

class Home extends React.Component {
    constructor(props){
        super(props);
    }
    
    state = {
        refreshing : false,
        stories : [],
        events : [],
        channel_data : '',
        stats : {channel_visits : '' , action_taken : '', reactions : ''}
    };

    componentDidMount() {
        this.refresh();
    }

    refresh = () =>{
        this.setState({refreshing : true});
        this.fetchChannel(()=>{
            this.fetchEvents((last_updated)=>{
                this.queryLatestEvent(last_updated, ()=>{
                    this.queryLatestStories(()=>{
                        this.fetchStories(()=>{
                            this.readStories(()=>{
                                this.setState({refreshing : false});
                            });
                        });
                    });
                });
            });
        });
    }

    fetchChannel = (callback) =>{
        axios.post(urls.FETCH_CHANNEL_DATA, {}, {
            headers: {
            'x-access-token': new SessionStore().getValue(constants.TOKEN)
            }
        }).then((response) => {
            const responseObj = response.data;
            if (!responseObj.error) {
                const obj = responseObj.data[0];
                new SessionStore().putValue(constants.USER_DATA, obj);
            } else {
                console.log(responseObj);
            }
            callback();
        })
        .catch((err)=>{
            console.log(err);
            callback();
        });
    }

    fetchStories = (callback) =>{
        Realm.getRealm((realm) => {
            const d = new Date(new Date().getTime() - (STORY_THRESHOLD *  24  * 60 * 60 * 1000));
            const latest = realm.objects('Activity').filtered('timestamp > $0', d).sorted('timestamp', true);
            processRealmObj(latest, (result)=>{
                this.setState({stories : result});
            });
            callback();
        });
    }

    readStories = (callback) =>{
        const stories = this.state.stories;
        const stats = {
            story_views : 0,
            channel_visits : 0,
            action_taken : 0,
            reactions : 0
        };
        for(let i=0; i<stories.length; i++){
            let current = stories[i];
            stats.story_views += parseInt(current.story_views);
            stats.channel_visits += parseInt(current.channel_visits);
            stats.action_taken += parseInt(current.action_taken);
            stats.reactions += parseInt(current.reactions);
        };
        this.setState({stats}, ()=>{
            return callback();
        });
    }

    queryLatestStories = (callback) => {
        const formData = new FormData();
        const user_data = new SessionStore().getValue(constants.USER_DATA);
        formData.append('channel_id', user_data._id);
        axios.post(urls.GET_STORY_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': new SessionStore().getValue(constants.TOKEN)
        }
        }).then((response) => {
            const responseObject = response.data;
            console.log(responseObject);
            if (!responseObject.error) {
                Realm.getRealm((realm) => {
                    Object.entries(responseObject.data).forEach(([key, el] ) => {
                        el.reach = JSON.stringify(el.reach);
                        el.views = JSON.stringify(el.views);
                        el.channel_visits = JSON.stringify(el.channel_visits);
                        el.story_views = JSON.stringify(el.story_views);
                        el.action_taken = JSON.stringify(el.action_taken);
                        el.reactions = JSON.stringify(el.reactions);
                        el.my_reactions = JSON.stringify(el.my_reactions);
                        el.audience = JSON.stringify(el.audience);
                        el.timestamp = new Date(el.timestamp);
                        if (el.type === 'post-video') {
                            el.media = el.media;
                        } else { 
                            el.media = JSON.stringify(el.media === undefined ? '' : el.media);
                        }
                        try {
                            realm.write(() => {
                                realm.create('Activity', el, true);
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    });
                 });
                callback();
            } else callback();
        }).catch(err => {
            console.log(err);
            callback();
        });
    }

    queryLatestEvent = (last_updated, callback) => {
        axios.post(urls.URL_GET_EVENTS, {last_updated}, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': new SessionStore().getValue(constants.TOKEN)
            }
        }).then( response => {
            if(!response.data.error) {
                response.data.data.forEach((el)=>{
                    el.reach = JSON.stringify(el.reach);
                    el.views = JSON.stringify(el.views);
                    el.enrollees = JSON.stringify(el.enrollees);
                    el.enrollees_size = JSON.stringify(el.enrollees_size);
                    el.interested = JSON.stringify(el.interested);
                    el.audience = JSON.stringify(el.audience);
                    el.media = JSON.stringify(el.media);
                    el.timestamp = new Date(el.timestamp);
                    el.time = new Date(el.time);
                    el.ms = Date.parse(''+el.date);
                    el.date = new Date(el.date);
                });
                
                let data = response.data.data;
                if(data.length === 0) return callback();
                Realm.getRealm((realm) => {
                    realm.write(() => {
                        let i;
                        for(i=0;i<data.length;i++) {
                            try {
                                realm.create('Events', data[i], true);
                            } catch(e) {
                                console.log(e);
                            }
                        }
                    });
                    const cs = Date.parse(new Date());
                    let current = realm.objects('Events').filtered(`ms > ${cs}`).sorted('timestamp', true);
                    processRealmObj(current, (result)=>{
                        this.setState({ events: result});
                    });
                });
                callback();
            } else callback();
        }).catch( err => {
            console.log(err);
            callback();
        });
    }

    handleEventPress = (item) =>{
        Navigation.showModal({
            component: {
              name: 'Update Event Screen',
              passProps:{
                data : item
              },
              options: {
                topBar: {
                  visible: false
                }
              }
            }
        });
    }
    
    handleStoryPreview = ()=>{
        Navigation.showOverlay({
            component: {
              name: 'Story Preview Screen',
              passProps: { stories : this.state.stories },
              options: {
                overlay: {
                  interceptTouchOutside: false
                }
              }
            }
        });
    }

    fetchEvents = (callback) => {
        Realm.getRealm((realm) => {
            const cs = Date.parse(new Date());
            let current = realm.objects('Events').filtered(`ms > ${cs}`).sorted('timestamp', true);
            processRealmObj(current, (result)=>{
                if(result.length > 0) {
                    this.setState({ events: result});
                    callback(result[0].timestamp);
                }
                else callback('NIL');
            });                
        });
    }

    getThumbnail = (data) =>{
        switch(data.type) {
            case 'post' : return <PostThumbnail data = {data} frozen = {true} />
            case 'post-image' : return <ImageThumbnail data = {data} frozen = {true} />
            case 'post-video' : return <VideoThumbnail data = {data} frozen = {true} />
        }
    }
    
    
    render() {
        const { refreshing, stories, events, stats  } = this.state;
        return(
            <View style={{flex: 1}}>
                <ScrollView style={{flex : 1}} refreshControl = {
                    <RefreshControl 
                        refreshing = {refreshing} 
                        onRefresh = {this.refresh}
                    />
                }>
                { stories.length > 0 &&
                    <View 
                        style={{flexDirection : 'row', height : 150, borderRadius : 10, backgroundColor : '#efefef', margin : 10, alignItems : 'center'}}
                        >
                        <View>
                            <View style={{width : 75, height : 75, borderRadius : 75, overflow : 'hidden', justifyContent : 'center', alignItems : 'center', margin : 10}}>
                                {
                                    this.getThumbnail(stories[0])
                                }
                                <TouchableOpacity 
                                    style={{position : 'absolute', backgroundColor : 'rgba(50, 50, 50, 0.5)', width : '100%', height : '100%',justifyContent : 'center', alignItems : 'center'}} activeOpacity = {0.2}
                                    onPress = {this.handleStoryPreview}
                                >
                                    <Icon name = 'play-circle-outline' color = '#efefef' size = {30} />
                                </TouchableOpacity>
                            </View>

                            <Text style={{margin : 5, fontSize : 11, color : '#333', textAlign : 'center'}}>{timelapse(new Date(stories[0].timestamp)) + ' ago' }</Text>
                        </View>

                        <View>
                        <Text style={{fontSize : 10, textAlign : 'center', margin : 2, color : '#777', paddingLeft : 10}}>REACTIONS</Text>
                        <View style={{width : 70, backgroundColor : '#ddd', padding : 5, paddingTop : 10, paddingBottom : 10, borderRadius : 10, marginLeft : 10, justifyContent : 'center', alignItems : 'center'}}>
                            <Icon3 name = 'heartbeat' size = {22} color = '#555' />
                            <Text style={{margin : 5, fontSize : 12, color : '#333', textAlign : 'center'}}>
                                {stats.reactions}
                            </Text>
                        </View>
                        </View>

                        <View>
                        <Text style={{fontSize : 10, textAlign : 'center', margin : 2, color : '#777', paddingLeft : 8}}>ACTIONS</Text>
                        <View style={{width : 70, backgroundColor : '#ddd', padding : 5, paddingTop : 10, paddingBottom : 10, borderRadius : 10, marginLeft : 10, justifyContent : 'center', alignItems : 'center'}}>
                            <Icon name = 'link' size = {22} color = '#555' />
                            <Text style={{margin : 5, fontSize : 12, color : '#333', textAlign : 'center'}}>
                                {stats.action_taken}
                            </Text>
                        </View>
                        </View>

                        <View>
                        <Text style={{fontSize : 10, textAlign : 'center', margin : 2, color : '#777', paddingLeft : 8}}>VISITS</Text>
                        <View style={{ width : 70, backgroundColor : '#ddd', padding : 5, paddingTop : 10, paddingBottom : 10, borderRadius : 10, marginLeft : 10, justifyContent : 'center', alignItems : 'center'}}>
                            <Icon3 name = 'share' size = {22} color = '#555' />
                            <Text style={{margin : 5, fontSize : 12, color : '#333', textAlign : 'center'}}>
                                {stats.channel_visits}
                            </Text>
                        </View>
                        </View>

                    </View>
                }

                {
                    stories.length === 0 && !refreshing &&
                    <InformationCard
                        touchable
                        onPress={
                            () => {
                            Navigation.mergeOptions(this.props.componentId, {
                                bottomTabs: {
                                currentTabIndex: 1
                                }
                            });
                            }
                        }
                        title="Create New Story"
                        content="You have no stories. You can see analytics for your stories here. Tap to create a story."
                        icon={(
                            <Icon4 name = 'md-albums' color  = '#999' size = {40} style={{alignSelf : 'center', margin : 10}} />
                        )}
                        style_card={{ backgroundColor: '#ddd' }}
                        style_title={{ color: '#333' }}
                        style_content={{ color: '#444', }}
                    />
                }
                <FlatList
                    data = {events}
                    keyExtractor={(item, index) => `${index}`}
                    extraData = {this.state}
                    initialNumToRender = {3}
                    renderItem = {({item})=>
                        <EventCardBig
                            onPress={ () => this.handleEventPress(item)}
                            width={WIDTH - 20}
                            height={(WIDTH - 20) * 0.75}
                            item={item}
                        />
                    }
                />
                </ScrollView>
            </View>
        );
    }
}

export default Home;