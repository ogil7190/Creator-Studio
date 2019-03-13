/* eslint-disable global-require */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  WebView
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import SessionStore from '../SessionStore';

class PrivacyPolicyScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
  }

  componentDidMount(){
    new SessionStore().pushTrack({type : 'OPEN_T_N_C'});
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop : Platform.OS === 'ios' ? 45 : 8,
          backgroundColor: '#514A9D'
        }}
      >
        <View style={{backgroundColor : '#514A9D', flexDirection : 'row'}}>
          <TouchableOpacity onPress={()=>Navigation.dismissModal(this.props.componentId)}>
            <Text style={{fontSize : 15, margin : 8, color : '#ddd'}}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
        <WebView 
        source = {{uri : 'https://mycampusdock.chat/privacy-policy'}}
        />
      </View>
    );
  }
}

export default PrivacyPolicyScreen;
