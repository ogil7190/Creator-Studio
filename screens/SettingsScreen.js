import React from 'react';
import { Text, StatusBar, Platform, View, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import { Navigation } from 'react-native-navigation';
import Realm from '../realm';
import {goInitializing} from './helpers/Navigation'
import SessionStore from '../SessionStore';
import urls from '../URLS';

class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        
    }

    gotoScreen = (screen) =>{
        Navigation.showModal({
            component: {
              name: screen,
              passProps: {
                
              },
              options: {
                topBar: {
                  visible: false
                }
              }
            }
        });
    }

    logout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout? You have to login again to use the app.',
            [
                {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
                },
                {text: 'Logout', onPress: () => {
                    Realm.getRealm((realm)=>{
                        realm.write(async () => {
                          realm.deleteAll();
                          await new SessionStore().reset();
                          Navigation.dismissModal(this.props.componentId);
                          goInitializing();
                        });
                    });
                }},
            ]
        );
    }

    render() {
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>
                <View style={{flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity onPress = {()=>Navigation.dismissModal(this.props.componentId)}>
                        <Icon name = 'ios-arrow-round-back' size = {30} style={{margin : 5, width : 50}} />
                    </TouchableOpacity>
                    
                    <View style={{flex : 1}}/>

                    <Text style={{fontSize : 18, textAlign : 'center', fontFamily : 'Roboto-Light'}}>Settings</Text>
                    
                    <View style={{flex : 1}}/>
                    
                    <View style={{width : 50,height : 25}}/>
                </View>

                <View style={{flex : 1, backgroundColor : '#efefef'}}>
                    <TouchableOpacity style={{flexDirection : 'row', padding : 10, marginTop : 5, backgroundColor : '#fff'}} activeOpacity = {0.7} onPress = {()=>this.gotoScreen('Update Channel Screen')}>
                        <View style={{flex : 1}}>
                            <Text style={{fontSize : 15, color : '#333'}}>
                                Edit My Channel
                            </Text>
                            <Text style={{fontSize : 11, marginTop : 5, color : '#888'}}>
                                Change details about you channel.
                            </Text>
                        </View>
                        <Icon2 name = 'square' size = {25} color = '#514A9D' />
                    </TouchableOpacity>

                    <TouchableOpacity style={{flexDirection : 'row', padding : 10, marginTop : 5, backgroundColor : '#fff'}} activeOpacity = {0.7} onPress = {()=>this.gotoScreen('Manage Moderators')}>
                        <View style={{flex : 1}}>
                            <Text style={{fontSize : 15, color : '#333'}}>
                                Manage Moderators
                            </Text>
                            <Text style={{fontSize : 11, marginTop : 5, color : '#888'}}>
                                Add or remove a moderator for channel.
                            </Text>
                        </View>
                        <Icon3 name = 'users-cog' size = {25} color = '#514A9D' />
                    </TouchableOpacity>

                    <TouchableOpacity style={{flexDirection : 'row', padding : 10, marginTop : 5, backgroundColor : '#fff'}} activeOpacity = {0.7} onPress = {()=>this.gotoScreen('Privacy Policy Screen')}>
                        <View style={{flex : 1}}>
                            <Text style={{fontSize : 15, color : '#333'}}>
                                Privacy Policy
                            </Text>
                            <Text style={{fontSize : 11, marginTop : 5, color : '#888'}}>
                                Read our Privacy Policy
                            </Text>
                        </View>
                        <Icon3 name = 'users-cog' size = {25} color = '#514A9D' />
                    </TouchableOpacity>

                    <TouchableOpacity style={{flexDirection : 'row', padding : 10, marginTop : 5, backgroundColor : '#fff'}} activeOpacity = {0.7} onPress = {()=>this.gotoScreen('Terms Screen')}>
                        <View style={{flex : 1}}>
                            <Text style={{fontSize : 15, color : '#333'}}>
                                App Usage Terms
                            </Text>
                            <Text style={{fontSize : 11, marginTop : 5, color : '#888'}}>
                                Terms for using this App.
                            </Text>
                        </View>
                        <Icon3 name = 'users-cog' size = {25} color = '#514A9D' />
                    </TouchableOpacity>

                    <TouchableOpacity style={{flexDirection : 'row', padding : 10, marginTop : 5, backgroundColor : '#fff'}} activeOpacity = {0.7} onPress = {this.logout}>
                        <View style={{flex : 1}}>
                            <Text style={{fontSize : 15, color : '#333'}}>
                                Logout
                            </Text>
                            <Text style={{fontSize : 11, marginTop : 5, color : '#888'}}>
                                Logout from this session.
                            </Text>
                        </View>
                        <Icon3 name = 'user-shield' size = {25} color = '#514A9D' />
                    </TouchableOpacity>
                </View>

                <View style={{position : 'absolute', justifyContent : 'center', alignItems : 'center', bottom : 15, flexDirection : 'row'}}>
                    <Text style={{color : '#999', width : '100%', textAlign : 'center', fontSize : 12}}>
                        {
                            urls.APP_VERSION
                        }
                    </Text>
                </View>
            </View>
        );
    }
}

export default SettingsScreen;