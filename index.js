import {Platform, AppState} from 'react-native';
import { Navigation } from "react-native-navigation";
import Initializing from "./screens/Initializing";
import Home from "./screens/Home";
import CreateEventScreen from "./screens/CreateEventScreen";
import videoModalScreen from "./screens/videoModalScreen";
import ProfileScreen from "./screens/ProfileScreen";
import StoryScreen from "./screens/StoryScreen";
import SubmitStory from "./screens/SubmitStory";
import SettingsScreen from "./screens/SettingsScreen";
import AddHashTagScreen from "./screens/AddHashTagScreen";
import ShareLinkScreen from "./screens/ShareLinkScreen";
import PromoteEventScreen from "./screens/PromoteEventScreen";
import UpdateEventScreen from "./screens/UpdateEventScreen";
import StoryPreviewScreen from "./screens/StoryPreviewScreen";
import UpdateChannelScreen from "./screens/UpdateChannelScreen";
import ManageModerators from "./screens/ManageModerators";
import ChangePassword from "./screens/ChangePassword";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import TermsScreen from "./screens/TermsScreen";
import SessionStore from './SessionStore';
import CodePush from 'react-native-code-push';
import NavigationComponents from './NavigationComponents';
import urls from './URLS';

this.state = {
  appState : AppState.currentState,
};

Navigation.registerComponent(`Initializing Screen`, () => Initializing);
Navigation.registerComponent(`Home Screen`, () => Home);
Navigation.registerComponent(`homeTopBar`, () => NavigationComponents.HOME_TOP_BAR);
Navigation.registerComponent(`storyTopBar`, () => NavigationComponents.STORY_TOP_BAR);
Navigation.registerComponent(`home.ArchiveIcon`, () => NavigationComponents.ARCHIVE_ICON);
Navigation.registerComponent(`home.CreateEventIcon`, () => NavigationComponents.CREATE_EVENT_ICON);
Navigation.registerComponent(`story.HelpIcon`, () => NavigationComponents.HELP_STORY_ICON);
Navigation.registerComponent(`story.DoneIcon`, () => NavigationComponents.DONE_STORY_ICON);
Navigation.registerComponent(`settings.Icon`, () => NavigationComponents.SETTINGS_ICON);
Navigation.registerComponent(`Create Event Screen`, () => CreateEventScreen);
Navigation.registerComponent(`Video Modal Screen`, () => videoModalScreen);
Navigation.registerComponent(`Profile Screen`, () => ProfileScreen);
Navigation.registerComponent(`Story Screen`, () => StoryScreen);
Navigation.registerComponent(`Submit Story`, () => SubmitStory);
Navigation.registerComponent(`Add HashTag Screen`, () => AddHashTagScreen);
Navigation.registerComponent(`Share Link Screen`, () => ShareLinkScreen);
Navigation.registerComponent(`Promote Event Screen`, () => PromoteEventScreen);
Navigation.registerComponent(`Update Event Screen`, () => UpdateEventScreen);
Navigation.registerComponent(`Story Preview Screen`, () => StoryPreviewScreen);
Navigation.registerComponent(`Settings Screen`, () => SettingsScreen);
Navigation.registerComponent(`Update Channel Screen`, () => UpdateChannelScreen);
Navigation.registerComponent(`Manage Moderators`, () => ManageModerators);
Navigation.registerComponent(`Change Password`, () => ChangePassword);
Navigation.registerComponent(`Privacy Policy Screen`, () => PrivacyPolicyScreen);
Navigation.registerComponent(`Terms Screen`, () => TermsScreen);

init = () =>{
  Navigation.setRoot({
    root: {
      component: {
        name: "Initializing Screen"
      }
    }
  });
}

checkCodePushUpdate  = () =>{
  return  CodePush.sync({
    checkFrequency: CodePush.CheckFrequency.ON_APP_START,
    installMode: CodePush.InstallMode.ON_NEXT_SUSPEND,
    deploymentKey: Platform.OS === 'ios' ? urls.CODEPUSH_IOS : urls.CODEPUSH_ANDROID,
  });
}

Navigation.events().registerAppLaunchedListener(async () => {
  AppState.addEventListener('change', this.onAppStateChanged);
  const store = new SessionStore();
  // this.checkCodePushUpdate();
  await store.getValueBulk();
  this.init();
});

submission = async () =>{
  await new SessionStore().setValueBulk();
}

onAppStateChanged = (nextAppState) => {
  if (this.state.appState.match(/inactive|background/) && nextAppState === 'active'){
    console.log('Background - Forground');
  } else if(nextAppState === 'background') {
    console.log('Background');
    if(Platform.OS === 'android') this.submission();
  } else if(nextAppState === 'active'){
    console.log('Forground');
  } else if(nextAppState === 'inactive'){
    console.log('Inactive');
    if(Platform.OS === 'ios') this.submission();
  }
  this.state.appState = nextAppState;
};