import Realm from 'realm';

var realmdb = null;

const Events = {
  name: 'Events',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    email: 'string?',
    college: 'string',
    reach: 'string',
    views: 'string',
    enrollees: 'string',
    enrollees_size : 'string',
    interested: 'string',
    timestamp: 'date',
    title: 'string',
    ms : 'int',
    description: 'string',
    location: 'string',
    category: 'string',
    date: 'date',
    time: 'date',
    channel_name: 'string',
    contact_details: 'string',
    faq: 'string?',
    reg_link : 'string?',
    audience: 'string',
    channel: 'string',
    media: 'string'
  }
};

const Activity = {
  name: 'Activity',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    reach: 'string',
    views: 'string',
    action_taken: 'string',
    story_views : 'string',
    channel_visits : 'string',
    reactions : 'string',
    my_reactions : 'string?',
    type: 'string',
    timestamp: 'date',
    channel: 'string',
    channel_name: 'string',
    audience: 'string',
    message: 'string',
    category: 'string',
    config : 'string?',
    reaction_type : 'string',
    media: 'string',
    read: 'bool?',
    hashtag : 'string?',
    url : 'string?',
    event : 'string?'
  }
};

const Archive = {
  name: 'Archive',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    type : 'string',
    timestamp : 'date'
  }
};

export default {
  getRealm: (callback) => { 
    if(realmdb === null) {
      return Realm.open({schema: [Events, Activity, Archive], deleteRealmIfMigrationNeeded: true })
        .then(realm => {
          realmdb = realm;
          callback(realmdb);
        });
    } else {
      callback(realmdb);
    }
  }
};