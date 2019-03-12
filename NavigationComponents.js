import React from 'react';
import {View, Text, Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import SessionStore from './SessionStore'
import Realm from './realm';
import {goInitializing} from './screens/helpers/Navigation';

const homeTopBar = () => (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding : 2
      }}
    >
      <Text style={{color : '#514A9D', fontSize : 18, margin : 4, textAlign : 'center', marginLeft : 10, marginRight : 10}}>Creator's Studio</Text>
    </View>
);

const archiveIcon = () => (
  <TouchableOpacity
    style={{
      padding : 5,
    }}
    onPress={
      () => {
        Navigation.showModal({
          component: {
            name: 'Archive Screen',
            options: {
              topBar: {
                visible: false
              }
            }
          }
        });
      }
    }
  >
    <Icon size={25} style={{ color: '#514A9D' }} name="archive"/>
  </TouchableOpacity>
);

const createEventIcon = () => (
  <TouchableOpacity
    style={{
      padding : 5,
    }}
    onPress={
      () => {
        Navigation.showModal({
          component: {
            name: 'Create Event Screen',
            options: {
              topBar: {
                visible: false
              }
            }
          }
        });
      }
    }
  >
    <Icon2 size={25} style={{ color: '#514A9D' }} name="ios-create"/>
  </TouchableOpacity>
);

const helpStoryIcon = () => (
  <TouchableOpacity
    style={{
      padding : 5,
    }}
    onPress={
      () => {
        Realm.getRealm((realm)=>{
          realm.write(async () => {
            realm.deleteAll();
            await new SessionStore().reset();
            goInitializing();
          });
        });
      }
    }
  >
    <Icon2 size={25} style={{ color: '#514A9D' }} name="md-help-circle"/>
  </TouchableOpacity>
);

const settingsIcon = () => (
  <TouchableOpacity
    style={{
      padding : 5,
    }}
    onPress={
      () => {
        Navigation.showModal({
          component: {
            name: 'Settings Screen',
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
    }
  >
    <Icon2 size={25} style={{ color: '#514A9D' }} name="md-settings"/>
  </TouchableOpacity>
);

const doneStoryIcon = () => (
  <TouchableOpacity
    style={{
      padding : 5,
    }}
    onPress={
      () => {
        const active = new SessionStore().getValueTemp('active');
        if(active !== null){
          const data = active.exportData();
          if(data.empty) return Alert.alert('Create A Story', 'Fill data to procedd.');
          Navigation.showModal({
            component: {
              name: 'Submit Story',
              passProps: {
                data
              },
              options: {
                topBar: {
                  visible: false
                }
              }
            }
          });
        }
      }
    }
  >
    <Icon2 size={25} style={{ color: '#514A9D' }} name="md-checkmark-circle"/>
  </TouchableOpacity>
);

const navigationComponents = {
    HOME_TOP_BAR : homeTopBar,
    ARCHIVE_ICON : archiveIcon,
    CREATE_EVENT_ICON : createEventIcon,
    HELP_STORY_ICON : helpStoryIcon,
    SETTINGS_ICON : settingsIcon,
    DONE_STORY_ICON : doneStoryIcon
}

export default navigationComponents;