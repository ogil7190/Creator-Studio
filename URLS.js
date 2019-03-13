const DEBUG_APP =  false; /* ACROSS THE APP */
const DEBUG_NETWORK = false; /* FOR ALL NETWORK REQUEST */

const PREFIX = DEBUG_NETWORK ? 'http://127.0.0.1:65534' : 'https://www.mycampusdock.chat';

const STAGING_CODEPUSH_IOS = 'CFnvtday9l-u0IBUysZDlf6nPiqkefea177c-2876-4bb3-b267-0f984d263df9';
const PRODUCTION_CODEPUSH_IOS = 'F0fvU9q5LjChp7b71kJypS0KwebHefea177c-2876-4bb3-b267-0f984d263df9';

const PRODUCTION_CODEPUSH_ANDROID = '32ABJvLqeFXJNp7z2JL7gSGgotQnefea177c-2876-4bb3-b267-0f984d263df9';
const STAGING_CODEPUSH_ANDROID = 'oXlK7tqi_EF8rhzGs7egOvkmmDD9efea177c-2876-4bb3-b267-0f984d263df9';

const APP_VERSION = 'App Version : 1.2 | CP V3'

const urls = {
  PREFIX,
  APP_VERSION,
  CODEPUSH_IOS : DEBUG_APP ? STAGING_CODEPUSH_IOS : PRODUCTION_CODEPUSH_IOS,
  CODEPUSH_ANDROID : DEBUG_APP ? STAGING_CODEPUSH_ANDROID : PRODUCTION_CODEPUSH_ANDROID,
  URL_SIGNIN : PREFIX + '/auth/manager/signin',
  URL_GET_EVENTS : PREFIX + '/events/manager/get-event-list',
  GET_STORY_URL : PREFIX + '/channels/get-story',
  URL_CREATE_POST_STORY : PREFIX + '/channels/manager/create-post',
  URL_CREATE_VIDEO_STORY : PREFIX + '/channels/manager/create-video-post',
  URL_CREATE_IMAGE_STORY : PREFIX + '/channels/manager/create-image-post',
  URL_CREATE_EVENT : PREFIX + '/events/manager/create',
  URL_UPDATE_EVENT : PREFIX + '/events/manager/update',
  FETCH_EVENT_DATA : PREFIX + '/events/manager/fetch-event-data',
  FETCH_CHANNEL_DATA : PREFIX + '/channels/manager/fetch-channel-data',
  URL_UPDATE_CHANNEL : PREFIX + '/channels/manager/update-channel',
  URL_ADD_MEMBER : PREFIX + '/channels/manager/add-member',
  URL_REMOVE_MEMBER : PREFIX + '/channels/manager/remove-member',
  URL_GET_MEMBERS_LIST : PREFIX + '/channels/manager/get-member-list',
};

export default urls;
