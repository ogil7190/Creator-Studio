import React from 'react';
import { Platform, View, StatusBar, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

class ManageModerators extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        
    }

    render() {
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>
                <View style={{flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center'}}>
                    <TouchableOpacity onPress = {()=>Navigation.dismissModal(this.props.componentId)}>
                        <Icon name = 'ios-arrow-round-back' size = {30} style={{margin : 5, width : 50}} />
                    </TouchableOpacity>
                    
                    <View style={{flex : 1}}/>

                    <Text style={{fontSize : 16, textAlign : 'center', fontFamily : 'Roboto-Light'}}>Manage Moderators</Text>
                    
                    <View style={{flex : 1}}/>
                    
                    <TouchableOpacity onPress={this.handleDone}>
                        <Text style={{fontSize : 15, textAlign : 'center', margin : 5, width : 50, color : 'blue'}}>Done</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex : 1 , backgroundColor : '#efefef'}}>
                <Text style={{textAlign : 'center', fontSize : 15, color : "#333", margin : 10}}>
                {
                    'You wil be able to create sub accounts for your moderators!'
                }
                </Text>
                </View>
            </View>
        );
    }
}

export default ManageModerators;