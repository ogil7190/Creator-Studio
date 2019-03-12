import React from 'react';
import { Text, StatusBar, Platform, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

class ShareLinkScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        url : '',
        valid : false
    }

    validateURL = (url) =>{
        const re = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        if(re.test(url)){
            this.setState({url, valid : true});
        } else {
            this.setState({url, valid : false});
        }
    }
    
    handleDone = () =>{
        if(this.state.url !== '' && this.state.valid){
            this.props.onUpdate({type : 'url', value : this.state.url});
            Navigation.dismissModal(this.props.componentId);
        } else {
            Alert.alert('Put Valid URL', 'Please put valid URLs, copy them and paste them here.');
        }
    }

    componentDidMount(){
        if(this.props.data && this.props.data.type === 'url'){
            this.setState({url : this.props.data.value, valid : true});
        }
    }

    render() {
        const{ url, valid} = this.state;
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>
                <View style={{flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity onPress = {()=>Navigation.dismissModal(this.props.componentId)}>
                        <Icon name = 'ios-arrow-round-back' size = {30} style={{margin : 5, width : 50}} />
                    </TouchableOpacity>
                    
                    <View style={{flex : 1}}/>

                    <Text style={{fontSize : 16, textAlign : 'center', fontFamily : 'Roboto-Light'}}>Share a Link</Text>
                    
                    <View style={{flex : 1}}/>
                    
                    <TouchableOpacity onPress = {()=>this.handleDone()}>
                        <Text style={{fontSize : 15, textAlign : 'center', margin : 5, width : 50, color : 'blue'}}>Done</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex : 1, backgroundColor : '#efefef'}}>
                    <TextInput
                        style={{color : '#333', fontSize : 15, borderRadius : 10, borderColor : '#888', padding : 10, borderWidth : 0.5, margin : 10}}
                        placeholder = 'Paste Your URL Here'
                        placeholderTextColor = '#555'
                        keyboardType = 'url'
                        keyboardAppearance = 'light'
                        value = {url}
                        onChangeText = {val =>this.validateURL(val)}
                    />
                    
                    {
                        valid && 
                        <Text style={{margin : 5, marginTop : 10, marginLeft : 10, color : '#333'}}>
                            This URL is OK
                        </Text>
                    }

                    <Text style={{fontSize : 12, color : '#555', margin : 5, marginTop : 10, marginLeft : 10}}>
                    {
                        'You can use URL to allow users to visit your +Youtube Channel, Instagram wall.' + 
                        'You can share your latest content & updates by sharing through valid URLs. Make use of this efficiently!'
                    }
                    </Text>
                </View>
            </View>
        
        );
    }
}

export default ShareLinkScreen;