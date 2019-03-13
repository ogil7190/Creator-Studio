import React from 'react';
import {TextInput, TouchableOpacity, ScrollView, Platform, View, Text, Image, ActivityIndicator, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather'
import { goHome } from './helpers/Navigation';
import Constants from '../constants';
import urls from '../URLS';
import { Navigation } from 'react-native-navigation'
import SessionStore from '../SessionStore';

class App extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        loading: false,
        user_id: '',
        password: '',
        error : ''
    }

    UNSAFE_componentWillMount(){
        const val = new SessionStore().getValue(Constants.SET_UP_STATUS);
        if(val){
            goHome();
        }
    }

    updataStatusAndToken = (token) => {
        const store = new SessionStore();
        store.putValue(Constants.TOKEN, token);
        store.putValue(Constants.SET_UP_STATUS, true);
        store.putValue(Constants.IS_FIRST_TIME, true);
        store.setValueBulk();
		goHome();
	}

    validData = (user_id, password) => {
        return user_id.length > 5 && password.length > 5;
    }

    handleLogin = (user_id, password, loading) => {
        if(loading) return;
        this.setState({ loading: true, error : ''});
        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('password', password);

        axios.post(urls.URL_SIGNIN, formData, {
			headers: {
			  'Content-Type': 'multipart/form-data',
			}
		  }).then((result) => {
              console.log(result);
            if(!result.data.error){
                this.setState({loading : false, error : ''}, ()=>{
                    this.updataStatusAndToken(result.data.token);
                });
            } else {
                this.setState({error : 'Wrong UserID or Password', loading : false});
            }
		  }).catch((e)=>{
            console.log(e);
            this.setState({error : 'Check Your Internet', loading : false});
          });
    }

    continueNext = () => {
        goHome();
    };

    gotoScreen = (name) =>{
        Navigation.showModal({
          component: {
            name,
            options: {
              topBar: {
                visible: false
              }
            }
          }
        });
      }

    render() {
        const {
            user_id, password, loading, error
        } = this.state;
        const enabled = this.validData(user_id, password);
        return(
            <View style={{ flex: 1 }}>
            <StatusBar hidden />
                <LinearGradient style={{ flex: 1 }} colors={['#514A9D', '#24C6DC']}>
                    <ScrollView
                    >
                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', marginTop : Platform.OS === 'ios' ?  80 : 60 }}>
                        <Image source={require('../media/LogoWhite.png')} style={{ width: 100, height: 100, resizeMode: 'contain', alignSelf: 'center' }} />
                        <Text style={{ marginTop: 20, fontFamily: 'Roboto-Regular', textAlign: 'center', color: '#fff', fontSize: 25 }}>Creator's Studio</Text>
                        <Text style={{ marginTop: 10, fontFamily: 'Roboto-Light', textAlign: 'center', color: '#fff', fontSize: 14 }}>Thinking BIG, Changing Lives</Text>
                        
                        <View style={{justifyContent : 'center', marginTop : 50}}>
                            <View style={{flexDirection : 'row', margin : 15, marginBottom : 1,  backgroundColor : '#fff', borderRadius : 10, justifyContent : 'center', alignItems : 'center'}}>
                                <TextInput
                                    autoCapitalize = 'none'
                                    keyboardType = 'default'
                                    style = {{flex : 1, fontSize : 18, margin : 15, marginTop : 10, marginBottom : 10, color : '#222'}}
                                    placeholder = 'User ID'
                                    placeholderTextColor = '#555'
                                    value = {user_id}
                                    onChangeText = {(val)=>this.setState({user_id : val})}
                                />
                            </View>

                            <View style={{flexDirection : 'row', margin : 15, marginTop : 1,  backgroundColor : '#fff', borderRadius : 10, justifyContent : 'center', alignItems : 'center'}}>
                                <TextInput
                                    autoCapitalize = 'none'
                                    secureTextEntry = {true}
                                    style = {{flex : 1, fontSize : 18, margin : 15, marginTop : 10, marginBottom : 10, color : '#222'}}
                                    placeholder = 'Password'
                                    placeholderTextColor = '#555'
                                    value = {password}
                                    onChangeText = {(val)=>this.setState({password : val})}
                                />
                            </View>

                            <TouchableOpacity activeOpacity = {0.8} onPress = {()=>this.gotoScreen('Privacy Policy Screen')}>
                                <Text style={{fontSize : 13, color : '#fff', textAlign : 'center', margin : 15, marginTop : 0,}}>
                                    {
                                        'By continuing furthur you agree to Campus Story '
                                    }
                                    <Text style={{textDecorationLine : 'underline'}}>
                                        {'terms of use & privacy policy.'}
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                            {
                                loading &&
                                <ActivityIndicator style={{ padding: 20 }} size="small" color="#fff" />
                            }
                            {
                                error !== '' &&
                                <Text style = {{fontSize : 15, color : 'yellow', textAlign : 'center', margin : 5}}>{error}</Text>
                            }
                            <View style={{flexDirection : 'row', margin : 10, padding : 5, marginTop : 1,  backgroundColor : '#fff', borderRadius : 40, alignSelf : 'center'}}>
                                <TouchableOpacity activeOpacity = {enabled ? 0.5 : 0.95} onPress = {()=> enabled ? this.handleLogin(user_id, password, loading) : console.log('NO WAY')}>
                                    <Icon name = 'arrow-right-circle' size = {35} color = {enabled ? '#444' : '#ddd'} style={{margin : 5}} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        </View>
                    </ScrollView>

                    <View style={{position : 'absolute', bottom : 20, alignSelf : 'center'}}>
                        <Text style={{color : '#fff', fontSize : 12, textAlign : 'center', fontFamily : 'Roboto-Light'}}>Campus Story 2019</Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    
}

export default App;