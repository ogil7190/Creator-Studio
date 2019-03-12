import {
  AsyncStorage
} from 'react-native';
import Constants from './constants';
import axios from 'axios';
import urls from './URLS';

const {
  SET_UP_STATUS,
  TOKEN,
  SESSION_ID,
  USER_DATA,
  LOGS,
  CONFIG,
  TRACKS,
  APP_USAGE_TIME
} = Constants;

export default class SessionStore {
  constructor() {
    const instance = this.constructor.instance;
    if (instance) {
        return instance;
    }
    this.constructor.instance = this;
  }

  state = {
    [TOKEN] : 'something',
    [CONFIG] : {},
    [SET_UP_STATUS] : false,
    [SESSION_ID] : '',
    [USER_DATA] : {}
  }

  temp = {

  }

  getValueFromStore = async (key)=>{
    let value = await AsyncStorage.getItem(key);
    return value;
  }

  putInStore = async (key, value) =>{
    await AsyncStorage.setItem(key, '' + value);
  }

  deleteFromStore = async (key) =>{
    await AsyncStorage.removeItem(key);
  }

  getValue = (key) =>{
    return this.state[key];
  }

  putValue = (key, value) =>{
    this.state[key] = value;
  }

  getValueTemp = (key) =>{
    return this.temp[key];
  }

  putValueTemp = (key, value) =>{
    this.temp[key] = value;
  }

  format = (obj, callback) =>{
    let res = [];
    let keys = Object.keys(obj);
    for(var i=0; i<keys.length; i++){
      res.push({_id : keys[i], count : obj[keys[i]].length})
      if(i==keys.length - 1){
        return callback(res);
      }
    }
  }

  reset = async () =>{
    this.state = {
      [TOKEN] : 'something',
      [CONFIG] : {},
      [SET_UP_STATUS] : false,
      [SESSION_ID] : '',
      [USER_DATA] : {}
    }
    
    /* CLEAN TEMP HOLDER MISSING */
    await AsyncStorage.clear();
  }

  getValueBulk = async () =>{
    let keys = Object.keys(this.state);
    let resArrays = await AsyncStorage.multiGet(keys);
    for(var i=0; i< resArrays.length; i++){
      this.state['' + resArrays[i][0]] = JSON.parse(resArrays[i][1]);
    }
    this.temp[APP_USAGE_TIME] = new Date().getTime();
  }

  setSessionId = async () => {
    let session = this.state[SESSION_ID];
    const config = this.state[CONFIG] === null ? {} : this.state[CONFIG];
    const id = config._id;
    if(session === null || session === ''){
      if(this.state.temp === null){
        this.state.temp = {}
      }
      this.state.temp[UPDATES] = [];
      this.state.temp[VIEWS] = [];
      this.state.temp[VISITS] = [];
      this.state[SESSION_ID] =  id === undefined || id === null ? new Date().getTime().toString() + '@temp' : new Date().getTime().toString() + '@' + id
    } else {
      let cs = new Date().getTime();
      let ts = parseInt(session.split('@')[0]);
      let diff = (cs - ts);
      if(diff > (24 * 3600 * 1000)){
        await this.deleteFromStore(SESSION_ID);
        if(this.state.temp === null){
          this.state.temp = {}
        }
        this.state.temp[UPDATES] = [];
        this.state.temp[VIEWS] = [];
        this.state.temp[VISITS] = [];
        this.state[SESSION_ID] =  id === undefined || id === null ? new Date().getTime().toString() + '@temp' : new Date().getTime().toString() + '@' + id
      }
    }
  }

  setValueBulk = async () =>{
    let arr = [];
    let keys = Object.keys(this.state);
    for(var i=0; i<keys.length; i++){
      arr.push([keys[i], JSON.stringify(this.state[keys[i]])]);
    }
    await AsyncStorage.multiSet(arr);
  }

  publishLogs = () =>{
    if(this.temp[LOGS].length > 0){
      const formData = new FormData();
      this.temp[LOGS] = [];
      formData.append('logs', JSON.stringify(this.temp[LOGS]));
      formData.append('session_id', JSON.stringify(this.state[SESSION_ID]));
      formData.append('dummy', [{_id : 'something'}]);
      axios.post(urls.PUT_LOGS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': this.state[TOKEN]
        }
      }).then((response) => {
        console.log('LOGS',response);
      }).catch(err => console.log(err));
    }
  }

  publishTracks = () =>{
    if(this.temp[TRACKS].length > 0){
      const formData = new FormData();
      this.temp[TRACKS] = [];
      formData.append('logs', JSON.stringify(this.temp[TRACKS]));
      formData.append('session_id', JSON.stringify(this.state[SESSION_ID]));
      formData.append('dummy', [{_id : 'something'}]);
      axios.post(urls.PUT_TRACKS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': this.state[TOKEN]
        }
      }).then((response) => {
        console.log('TRACKS', response);
      }).catch(err => console.log(err));
    }
  }

  pushLogs = (element) =>{
    let logs = this.temp[LOGS] === null || this.temp[LOGS] === undefined ? [] : this.temp[LOGS];
    logs.push(element);
    this.temp[LOGS] = logs;
  }

  pushTrack = (element) =>{
    let logs = this.temp[TRACKS] === null || this.temp[TRACKS] === undefined ? [] : this.temp[TRACKS];
    logs.push(element);
    this.temp[TRACKS] = logs;
  }
};