import React from 'react';
import { Text, StatusBar, Platform, View, TextInput, ScrollView, Share, TouchableOpacity, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import {getMonthName, formatAMPM, getCategoryName} from './helpers/functions'
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Feather';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {categories} from './helpers/values';
import AdvertCard from '../components/AdvertCard';
import SessionStore from '../SessionStore';
import constants from '../constants';
import urls from '../URLS';
import axios from 'axios';
import RNFetchBlob from 'react-native-fetch-blob';
import FileViewer from 'react-native-file-viewer';

class UpdateEventScreen extends React.Component {
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
        updated : false,
        isDateTimePickerVisible : false
    }

    componentDidMount(){
        let interests = [];
        for (i = 0; i < categories.length; i++) {
            interests.push(categories[i]);
        }
        this.setState({interests});
        console.log('Data', this.props.data);
        const { _id, category, media, title, date, time, location, description, contact_details, faq, reg_link} = this.props.data;
        const image = urls.PREFIX + '/' + JSON.parse(media)[0];
        this.setState({_id, category, title, date, time, location, description, contact_details, faq, reg_link, imageURI : image});
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

    share = async () => {
        const { title, location, time, description, contact_details, faq, reg_link, date, category } = this.state;
        const message = '' + 
            '*' + title + '* ' + '(A ' + getCategoryName(category) + ' event)' +
            '\n\n' +
             'Date : ' + date.getDate() + '-' + getMonthName(date.getMonth() + 1) + '-' + date.getFullYear() +
             '\n' + 
             'Time : ' + formatAMPM(time) + 
             '\n' +
             'Venue : ' + location +
             '\n\n' +
             ' *About the event*'  + 
             '\n' + 
             description + 
             '\n\n' + 
            '*FAQs* ' + '\n' + faq +
            '\n' + 
            'Contact Details : ' + contact_details + 
            '\n\n' +
            '*Campus Story Download Now* | Explore everything around you using Campus Story. Register easily in events & discover different stories around you from campus.'

        try {
          const result = await Share.share({
            message
          })
    
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              
            } else {
              
            }
          } else if (result.action === Share.dismissedAction) {
            
          }
        } catch (error) {
          alert(error.message);
        }
    };

    validData = () =>{
        const { _id, title, location, time, description, contact_details, faq, reg_link, imageURI, date, category, updated } = this.state;
        let data = {};
        data._id = _id;
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

        console.log(data.reg_link);
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

        if(!updated){
            Alert.alert(
                'No Changes Made',
                'Please update something.'
            );
            return false;
        }
        
        return data;
    }

    handleUpdate = () =>{
        const data = this.validData();
        if(data){
            this.setState({ loading: true });
            const context = this;
            const formData = new FormData();
            formData.append('_id', data._id);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('location', data.location);
            formData.append('category', data.category);
            formData.append('date', data.date.toString());
            formData.append('time', data.time.toString());
            formData.append('contact_details', data.contact_details);
            formData.append('faq', data.faq);
            formData.append('reg_link', data.reg_link);
      
            axios.post(urls.URL_UPDATE_EVENT, formData, {
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
                  Alert.alert('Event Updated Successfully');
                } else {
                    Alert.alert('Somethign went wrong', 'Try again later');
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ loading: false });
                Alert.alert('Something went wrong!');
            });
        }
    }

    handleDownload = async () => {
        const enrollees = JSON.parse(this.props.data.enrollees);
        
        const values = [];
        enrollees.forEach( (value) => {
            console.log(value.name);
            values.push([value.email, value.phone, value.name]);
        });
        if(values.length > 0){
            const headerString = 'E-mail ID,Phone Number,Full Name\n';
            const rowString = values.map(d => `${d[0]},${d[1]},${d[2]}\n`).join('');
            const csvString = `${headerString}${rowString}`;
            
            const pathToWrite = `${RNFetchBlob.fs.dirs.DocumentDir}/${this.props.data.title.replace(/[\W_]+/g, "")}.csv`;

            RNFetchBlob.fs
            .writeFile(pathToWrite, csvString, 'utf8')
            .then(() => {
                console.log(`wrote file ${pathToWrite}`);
                const path = pathToWrite;
                FileViewer.open(path)
                .then(() => {
                    console.log('success file save');
                })
                .catch(error => {
                    console.log('fail file save');
                });
            })
            .catch(error => console.error(error));
        } else {
            Alert.alert('No Registrations Found', 'No one has registered for this event yet.');
        }
    }

    render() {
        const { category, title, location, time, description, contact_details, faq, reg_link, imageURI, date, interests } = this.state;
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>
                <View style={{flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity onPress = {()=>Navigation.dismissModal(this.props.componentId)}>
                        <Icon name = 'ios-arrow-round-back' size = {30} style={{margin : 5, width : 50}} />
                    </TouchableOpacity>
                    
                    <View style={{flex : 1}}/>

                    <Text style={{fontSize : 18, textAlign : 'center', fontFamily : 'Roboto-Light'}}>Update Event</Text>
                    
                    <View style={{flex : 1}}/>
                    
                    <TouchableOpacity onPress = {()=>this.handleUpdate()}>
                        <Text style={{fontSize : 14, textAlign : 'center', margin : 5, minWidth : 50, color : 'green'}}>Update</Text>
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
                                    uri: imageURI
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
                        <View
                            style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                            }}
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
                        </View>
                        <TextInput
                            numberOfLines = {1}
                            editable = {false}
                            maxLength = {40}
                            placeholder = "Event's Title"
                            placeholderTextColor = '#555'
                            style={{color : '#333', width : 50, borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5, fontSize : 16}}
                            autoCapitalize = 'sentences'
                            keyboardType = 'default'
                            keyboardAppearance = 'light'
                            value = {title}
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
                            onChangeText = {val=>this.setState({location : val, updated : true})}
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5,}}>
                        <View style={{
                            marginRight: 5,
                            width: 50,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 5
                            }}
                        >
                            <Icon3 style={{ alignSelf: 'center', color: '#514A9D', }} size={35} name="clock" />
                        </View>
                        <TextInput
                            numberOfLines = {1}
                            editable = {false}
                            maxLength = {20}
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
                            onChangeText = {val=>this.setState({description : val, updated : true})}
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
                            multiline = {true}
                            maxLength = {100}
                            placeholder = "Contact Details with name in brackets"
                            placeholderTextColor = '#555'
                            style={{color : '#333', borderWidth : 0.2, flex : 1, padding : 0, paddingLeft : 5, borderColor : '#888', borderRadius : 5, fontSize : 15, minHeight : 80}}
                            autoCapitalize = 'sentences'
                            keyboardType = 'default'
                            keyboardAppearance = 'light'
                            value = {contact_details}
                            onChangeText = {val=>this.setState({contact_details : val, updated : true})}
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
                            onChangeText = {val=>this.setState({faq : val, updated : true})}
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
                            onChangeText = {val=>this.setState({reg_link : val, updated : true})}
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
                                    checked = { category === item.value ? true : false}
                                    clickable = {false}
                                    image={item.image}
                                    text={item.title}
                                />
                            }
                        />
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5,  alignItems : 'center'}}>
                        <TouchableOpacity style={{
                            marginRight: 5,
                            width: 50,
                            height : 50,
                            borderRadius : 50,
                            backgroundColor : '#ddd',
                            justifyContent : 'center',
                            alignItems : 'center',
                            paddingTop: 5,
                            paddingBottom: 5
                            }}
                            onPress = {this.handleDownload}
                        >
                            <Icon5 style={{ alignSelf: 'center', color: '#514A9D', }} size={25} name="file-download" />
                        </TouchableOpacity>
                        <Text style={{textAlign : 'center', fontSize : 15, color : '#333', margin : 5, marginLeft : 10,}}>
                            {
                                'Download the list of the registerations.'
                            }
                        </Text>
                    </View>

                    <View style={{flexDirection : 'row', margin : 5, padding : 5,  alignItems : 'center'}}>
                        <TouchableOpacity style={{
                            marginRight: 5,
                            width: 50,
                            height : 50,
                            borderRadius : 50,
                            backgroundColor : '#ddd',
                            justifyContent : 'center',
                            alignItems : 'center',
                            paddingTop: 5,
                            paddingBottom: 5
                            }}
                            onPress = {this.share}
                        >
                            <Icon5 style={{ alignSelf: 'center', color: '#514A9D', }} size={22} name="share" />
                        </TouchableOpacity>
                        <Text style={{textAlign : 'center', fontSize : 15, color : '#333', margin : 5, marginLeft : 10,}}>
                            {
                                'Share event on Whatsapp'
                            }
                        </Text>
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
                    minimumDate = {new Date()}
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

export default UpdateEventScreen;