import React from 'react';
import { ActivityIndicator, Text, StatusBar, Platform, View, TextInput, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import {getMonthName, formatAMPM} from './helpers/functions'
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Feather';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {categories} from './helpers/values';
import AdvertCard from '../components/AdvertCard';
import SessionStore from '../SessionStore';
import constants from '../constants';
import urls from '../URLS';
import axios from 'axios';

class CreateEventScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        interests : [],
        category : '',
        imageURI : '',
        title : '',
        date : new Date(),
        time : new Date(),
        location : '',
        description : '',
        contact_details : '',
        faq : '',
        reg_link : '',
        isDateTimePickerVisible : false
    }

    componentDidMount(){
        let interests = [];
        for (i = 0; i < categories.length; i++) {
            interests.push(categories[i]);
        }
        this.setState({interests, category : interests[0]});
    }

    openImagePicker = () =>{
        const options = {
            title: 'Pick an Image',
            noData : true,
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

    _showDateTimePicker = picker => this.setState({ isDateTimePickerVisible: true, picker });
    
    _handleDatePicked = (val) => {
        this.setState({ [this.state.picker]: val });
        this._hideDateTimePicker();
    }

    _hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    validData = () =>{
        const { title, location, time, description, contact_details, faq, reg_link, imageURI, date, category } = this.state;
        let data = {};
        data.time = time;
        if(imageURI === '') {
            Alert.alert(
                'Fill Details Properly',
                'Image is mandatory for events, please pick an image.'
            );
            return false;
        }
        data.image = imageURI;

        if( Math.abs((date.getTime() - new Date().getTime())) < 2 * 60 * 60 * 1000){
            Alert.alert(
                'Fill Details Properly',
                'Please select a valid date for the event.'
            );
            return false;
        }
        data.date = date;

        if(title.trim().length <  5){
            Alert.alert(
                'Fill Details Properly',
                'Please put a valid title of the event.'
            );
            return false;
        }
        data.title = title.trim();

        if(location.trim().length < 5){
            Alert.alert(
                'Fill Details Properly',
                'Please put a valid location of the event.'
            );
            return false;
        }
        data.location = location.trim();

        if(description.trim().length <  5){
            Alert.alert(
                'Fill Details Properly',
                'Please put a valid description about the event.'
            );
            return false;
        }
        data.description = description.trim();

        if(contact_details.trim().length <  5){
            Alert.alert(
                'Fill Details Properly',
                'Please put a valid contact details about the event.'
            );
            return false;
        }
        data.contact_details = contact_details.trim();

        if(faq.trim().length > 0 && faq.trim().length < 5){
            Alert.alert(
                'Fill Details Properly',
                "Please put a valid FAQ's about the event."
            );
            return false;
        }
        data.faq = faq.trim();

        if(reg_link.trim().length > 0 && reg_link.trim().length < 5){
            Alert.alert(
                'Fill Details Properly',
                'Please put a valid registeration link of the event.'
            );
            return false;
        }
        data.reg_link = reg_link.trim();

        if(category === ''){
            Alert.alert(
                'Fill Details Properly',
                'Please select a valid category for the event.'
            );
            return false;
        }
        data.category = category.trim();

        return data;
    }

    handleDone = () =>{
        const data = this.validData();
        if(data){
            this.setState({ loading: true });
            const context = this;
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('location', data.location);
            formData.append('category', data.category);
            formData.append('date', data.date.toString());
            formData.append('time', data.time.toString());
            formData.append('contact_details', data.contact_details);
            formData.append('faq', data.faq);
            formData.append('reg_link', data.reg_link);

            formData.append('file', {
              uri: this.state.imageURI,
              type: this.state.imageType,
              name: new SessionStore().getValue(constants.USER_DATA).channel + '_' + this.state.imageName
            });
      
            axios.post(urls.URL_CREATE_EVENT, formData, {
              onUploadProgress(progressEvent) {
                      let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
                      context.setState({ progress: percentCompleted });
                },
              headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': new SessionStore().getValue(constants.TOKEN)
                }
            })
            .then((response) => {
                console.log(response);
                let result = response.data;
                if (!result.error) {
                  Navigation.dismissModal(this.props.componentId);
                  this.setState({ loading: false });
                  Alert.alert('Event Created Successfully');
                } else {
                    Alert.alert('Somethign went wrong', 'Try again later');
                }
            })
            .catch((err) => {
                console.log(err);
                Alert.alert('Somethign went wrong');
                this.setState({ loading: false });
            });
        }
    }

    render() {
        const { title, location, time, description, contact_details, faq, reg_link, imageURI, date, interests } = this.state;
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>
                <View style={{flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity disabled = {this.state.loading} onPress = {()=>Navigation.dismissModal(this.props.componentId)}>
                        {/* { this.state.loading && <Text style={{fontSize : 15, textAlign : 'center', margin : 5, width : 50, color : 'green'}}>Please Wait</Text> } */}
                        { !this.state.loading && <Icon name = 'ios-arrow-round-back' size = {30} style={{margin : 5, width : 50}} /> }
                    </TouchableOpacity>
                    
                    <View style={{flex : 1}}/>

                    <Text style={{fontSize : 18, textAlign : 'center', fontFamily : 'Roboto-Light'}}>Create an Event</Text>
                    
                    <View style={{flex : 1}}/>
                    
                    <TouchableOpacity disabled = {this.state.loading} onPress = {()=>this.handleDone()}>
                        { !this.state.loading && <Text style={{fontSize : 15, textAlign : 'center', margin : 5, width : 50, color : 'green'}}>Done</Text> }
                        { this.state.loading && <ActivityIndicator size="small" color="green" /> }
                    </TouchableOpacity>
                </View>

                <ScrollView style={{flex : 1, backgroundColor : '#efefef', marginRight : 5}}>
                    <View style={{margin : 10, borderRadius : 10, backgroundColor : '#ddd'}}>
                        {
                            imageURI === '' &&
                            <View style={{backgroundColor : '#ddd'}}>
                                <TouchableOpacity style={{height : 220, justifyContent : 'center', alignItems : 'center'}} onPress = {this.openImagePicker}> 
                                    <Icon2 name = 'images' size = {50} color = '#fff' />
                                    <Text style={{fontSize : 20, fontFamily : 'Roboto-Light', color : '#555'}}>Pick an Image</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {
                            imageURI.length > 0 && 
                            <FastImage 
                                source={{
                                    uri: encodeURI(imageURI)
                                }}
                                style={{
                                    height : 220,
                                    width : '100%',
                                    borderRadius : 10,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        }
                    </View>
                    
                    <View style={{flexDirection : 'row', margin : 5, padding : 5}}>
                        <TouchableOpacity
                            style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                            }}
                            onPress={()=>this._showDateTimePicker('date')}
                        >
                            <Text
                            style={{
                                fontFamily: 'Roboto',
                                fontSize: 15,
                                color: '#514A9D',
                                textAlign: 'center',
                                fontWeight: '900'
                            }}
                            >
                                { getMonthName(date.getMonth() + 1) }
                            </Text>
                            <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 22,
                                color: '#a0a0a0',
                            }}
                            >
                            { JSON.stringify(date.getDate()) }
                            </Text>
                        </TouchableOpacity>
                        <TextInput
                            numberOfLines = {1}
                            maxLength = {40}
                            placeholder = "Event's Title"
                            placeholderTextColor = '#555'
                            style={{color : '#333', width : 50, borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5, fontSize : 16}}
                            autoCapitalize = 'sentences'
                            keyboardType = 'default'
                            keyboardAppearance = 'light'
                            value = {title}
                            onChangeText = {val=>this.setState({title : val})}
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5}}>
                        <View style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                        }}>
                            <Icon2 style={{ alignSelf: 'center', color: '#514A9D', }} size={35} name="location-pin" />
                        </View>
                        <TextInput
                            numberOfLines = {1}
                            maxLength = {20}
                            placeholder = "Event's Location"
                            placeholderTextColor = '#555'
                            style={{color : '#333', borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5, fontSize : 15}}
                            autoCapitalize = 'sentences'
                            keyboardType = 'default'
                            keyboardAppearance = 'light'
                            value = {location}
                            onChangeText = {val=>this.setState({location : val})}
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5,}}>
                        <TouchableOpacity style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                            }}
                            onPress={()=>this._showDateTimePicker('time')}
                        >
                            <Icon3 style={{ alignSelf: 'center', color: '#514A9D', }} size={35} name="clock" />
                        </TouchableOpacity>
                        <TextInput
                            numberOfLines = {1}
                            editable = {false}
                            maxLength = {20}
                            onTouchStart = {()=>this._showDateTimePicker('time')}
                            placeholder = "Event's Time"
                            placeholderTextColor = '#555'
                            style={{color : '#333', borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5, fontSize : 15}}
                            autoCapitalize = 'sentences'
                            keyboardType = 'default'
                            keyboardAppearance = 'light'
                            value = {formatAMPM(time)}
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5}}>
                        <View style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                        }}>
                            <Icon2 style={{ alignSelf: 'center', color: '#514A9D', }} size={35} name="text" />
                        </View>
                        <TextInput
                            multiline = {true}
                            maxLength = {800}
                            placeholder = "Tell us about the event."
                            placeholderTextColor = '#555'
                            style={{color : '#333', borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5, fontSize : 15, minHeight : 100}}
                            autoCapitalize = 'sentences'
                            keyboardType = 'default'
                            keyboardAppearance = 'light'
                            value = {description}
                            onChangeText = {val=>this.setState({description : val})}
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5}}>
                        <View style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                        }}>
                            <Icon style={{ alignSelf: 'center', color: '#514A9D', }} size={35} name="ios-call" />
                        </View>
                        <TextInput
                            numberOfLines = {1}
                            maxLength = {80}
                            placeholder = "Contact Details with name in brackets"
                            placeholderTextColor = '#555'
                            style={{color : '#333', borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5, fontSize : 15,}}
                            autoCapitalize = 'sentences'
                            keyboardType = 'default'
                            keyboardAppearance = 'light'
                            value = {contact_details}
                            onChangeText = {val=>this.setState({contact_details : val})}
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5}}>
                        <View style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                        }}>
                            <Icon4 style={{ alignSelf: 'center', color: '#514A9D', }} size={35} name="comment-question" />
                        </View>
                        <TextInput
                            multiline = {true}
                            maxLength = {1000}
                            placeholder = "FAQ's & more  (optional)"
                            placeholderTextColor = '#555'
                            style={{color : '#333', borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5, fontSize : 15, minHeight : 100}}
                            autoCapitalize = 'sentences'
                            keyboardType = 'default'
                            keyboardAppearance = 'light'
                            value = {faq}
                            onChangeText = {val=>this.setState({faq : val})}
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5}}>
                        <View style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                        }}>
                            <Icon style={{ alignSelf: 'center', color: '#514A9D', }} size={35} name="md-link" />
                        </View>
                        <TextInput
                            numberOfLines = {1}
                            maxLength = {100}
                            placeholder = "Registration Link  (optional)"
                            placeholderTextColor = '#555'
                            style={{color : '#333', borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5, fontSize : 15,}}
                            autoCapitalize = 'sentences'
                            keyboardType = 'default'
                            keyboardAppearance = 'light'
                            value = {reg_link}
                            onChangeText = {val=>this.setState({reg_link : val})}
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5}}>
                        <View style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                        }}>
                            <Icon style={{ alignSelf: 'center', color: '#514A9D', }} size={35} name="md-pricetag" />
                        </View>
                        <FlatList
                            showsHorizontalScrollIndicator = {false}
                            style={{borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5,}}
                            data = {interests}
                            extraData = {this.state}
                            keyExtractor={(item, index) => `${index}`}
                            horizontal
                            renderItem={({ item }) => 
                                <AdvertCard
                                    width={80}
                                    height={80}
                                    clickable = {true}
                                    checked = { this.state.category === item.value ? true : false}
                                    onChecked = {()=>this.setState({category : item.value})}
                                    image={item.image}
                                    text={item.title}
                                />
                            }
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5}}>
                        <View style={{
                            marginRight: 5,
                            paddingTop: 5,
                            marginLeft : 10,
                            paddingBottom: 5,
                            borderRadius: 5
                        }}>
                            <Text style={{fontSize : 12, marginTop : 5, color : '#555'}}>
                            {
                                'We suggest you to check these details thoroughly as these details cannot be changed easily.\n\n' +
                                'Please use default registration form of the app as user tends to regitser in such events more frequently rather than google forms and other links.'
                            }
                            </Text>
                        </View>
                    </View>

                </ScrollView>
                <DateTimePicker
                    minimumDate = {this.state.picker === 'time' ? new Date('01-01-1990') : new Date()}
                    isVisible={this.state.isDateTimePickerVisible}
                    mode={this.state.picker === 'time' ? 'time' : 'date'}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    is24Hour = {false}
                />
            </View>
        );
    }
}

export default CreateEventScreen;