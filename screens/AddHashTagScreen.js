import React from 'react';
import { Text, StatusBar, Platform, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

class AddHashTagScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        hashtag : '',
        tag : ''
    }

    processTag = (hashtag) =>{
        const tag = hashtag.replace(/[\W_]+/g, ""); /* ONLY ALPHA NUMBERIC STRING */
        this.setState({hashtag, tag});
    }

    handleDone = () =>{
        if(this.state.tag.length > 3){
            this.props.onUpdate({type : 'hashtag', value : this.state.tag});
            Navigation.dismissModal(this.props.componentId);
        } else {
            Alert.alert('Put Valid Hashtag', 'HashTag must be more than 3 characters long.');
        }
    }

    componentDidMount(){
        if(this.props.data && this.props.data.type === 'hashtag'){
            this.setState({tag : this.props.data.value, hashtag : this.props.data.value});
        }
    }

    render() {
        const {hashtag, tag} = this.state;
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>
                <View style={{flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity onPress = {()=>Navigation.dismissModal(this.props.componentId)}>
                        <Icon name = 'ios-arrow-round-back' size = {30} style={{margin : 5, width : 50}} />
                    </TouchableOpacity>
                    
                    <View style={{flex : 1}}/>

                    <Text style={{fontSize : 16, textAlign : 'center', fontFamily : 'Roboto-Light'}}>Add a Hashtag</Text>
                    
                    <View style={{flex : 1}}/>
                    
                    <TouchableOpacity onPress = {()=>this.handleDone()}>
                        <Text style={{fontSize : 15, textAlign : 'center', margin : 5, width : 50, color : 'blue'}}>Done</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex : 1, backgroundColor : '#efefef'}}>
                    <TextInput
                        style={{color : '#333', fontSize : 15, borderRadius : 10, borderColor : '#888', padding : 10, borderWidth : 0.5, margin : 10}}
                        placeholder = '#HashTag'
                        placeholderTextColor = '#555'
                        keyboardType = 'email-address'
                        keyboardAppearance = 'light'
                        autoCapitalize = 'words'
                        value = {hashtag}
                        numberOfLines = {1}
                        maxLength = {50}
                        onChangeText = {val =>this.processTag(val)}
                    />
                    {
                        tag !== '' &&
                        <Text style={{fontSize : 15, color : '#333', margin : 5, marginTop : 10, marginLeft : 10}}>{'#' + tag}</Text>
                    }

                    <Text style={{fontSize : 12, color : '#555', margin : 5, marginTop : 10, marginLeft : 10}}>
                    {
                        'Use hashtags to allow your story to count in various trends.\n\n' + 
                        'HashTags can be #EventName #ChannelName #SomeTrend2019 #PopularWords #CollegeFest #FestNight #CanBeSeriousLongWords'
                    }
                    </Text>
                </View>
            </View>
        
        );
    }
}

export default AddHashTagScreen;