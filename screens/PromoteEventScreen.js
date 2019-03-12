import React from 'react';
import { Text, StatusBar, Platform, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import Realm from '../realm';
import {processRealmObj, getMonthName} from './helpers/functions'
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import urls from '../URLS';
import FastImage from 'react-native-fast-image';

class PromoteEventScreen extends React.Component {
    constructor(props) {
        super(props);
        
    }

    state = {
        data : [],
        selected : -1
    }

    componentDidMount(){
        Realm.getRealm((realm)=>{
            const cs = Date.parse(new Date());
            let current = realm.objects('Events').filtered(`ms > ${cs}`).sorted('timestamp', true);
            processRealmObj(current, (result)=>{
                this.setState({data : result});
            });
        });
    }

    handleDone = () =>{
        const {data, selected} = this.state;
        if(data.length === 0) return Navigation.dismissModal(this.props.componentId);
        if(selected !== -1){
            this.props.onUpdate({type : 'event', value : data[selected]._id});
            Navigation.dismissModal(this.props.componentId);
        } else {
            Alert.alert('No Event Selected', 'Please select an event to promote');
        }
    }

    render() {
        const { data, selected } = this.state;
        console.log(data);
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>
                <View style={{flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity onPress = {()=>Navigation.dismissModal(this.props.componentId)}>
                        <Icon name = 'ios-arrow-round-back' size = {30} style={{margin : 5, width : 50}} />
                    </TouchableOpacity>
                    
                    <View style={{flex : 1}}/>

                    <Text style={{fontSize : 16, textAlign : 'center', fontFamily : 'Roboto-Light'}}>Promote Event</Text>
                    
                    <View style={{flex : 1}}/>
                    
                    <TouchableOpacity onPress={this.handleDone}>
                        <Text style={{fontSize : 15, textAlign : 'center', margin : 5, width : 50, color : 'blue'}}>Done</Text>
                    </TouchableOpacity>
                </View>

                <View style = {{flex : 1, backgroundColor : '#efefef'}}>
                    {
                        data.length > 0 && 
                        <FlatList
                            keyExtractor={(item, index) => `${index}`}
                            style={{margin : 10}}
                            data = {data}
                            extraData = {this.state}
                            renderItem = {({item, index})=>
                                <TouchableOpacity style={{flexDirection : 'row', backgroundColor : '#ddd', margin : 10, padding : 10, borderRadius : 10}} onPress={()=>this.setState({selected : index})}>
                                    <View style = {{height : 80, width : 80, borderRadius : 80}}>
                                        <FastImage 
                                            source={{
                                                uri: encodeURI(urls.PREFIX + '/' + JSON.parse(item.media)[0])
                                            }}
                                            style={{
                                                height : 80,
                                                width : 80,
                                                borderRadius : 80,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                        {
                                            selected === index &&
                                            <View style={{position : 'absolute', backgroundColor : "#00000055", width : '100%', height : '100%', borderRadius : 80, justifyContent :'center', alignItems : 'center'}}>
                                                <Icon name='ios-checkmark-circle-outline' size = {30} color = '#fff' />
                                            </View>
                                        }
                                    </View>
                                    <View>
                                        <Text style={{fontSize : 15, color : '#333', margin : 5}}>
                                            {item.title}
                                        </Text>
                                        
                                        <Text style={{fontSize : 12, color : '#333', margin : 5}}>
                                        {item.location}
                                        {' • '}
                                        {getMonthName(item.date.getMonth() + 1) }
                                        {' '}
                                        {JSON.stringify(item.date.getDate())}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        />
                    }

                    {
                        data.length === 0 &&
                        <Text style = {{margin : 5, marginLeft : 10, marginTop : 20, fontSize : 12, color : '#555', textAlign : 'center'}}>
                        {'Ohho! You have no events, try making one to promote.'}
                        </Text>
                    }
                </View>
            </View>
        );
    }
}

export default PromoteEventScreen;