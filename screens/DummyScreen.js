import React from 'react';
import { Text, StatusBar, Platform, View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

class DummyScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        
    }

    render() {
        return(
            <View style={{flex: 1, backgroundColor : '#fff', marginTop : Platform.OS === 'ios' ? 45 : 8}}>

            </View>
        );
    }
}

export default DummyScreen;