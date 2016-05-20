angular.module('starter.config', [])
    .constant('DB_CONFIG', {
        name: 'd_conference.db',
        tables: [
            {
              name: 'eventdates',
              columns: [
                  {name: 'id', type: 'integer'},
                  {name: 'date', type: 'text'},
              ]
            },
            {
              name: 'programs',
              columns: [
                  {name: 'id', type: 'integer primary key'},
                  {name: 'title', type: 'text'},
                  {name: 'date', type: 'text'},
                  {name: 'room', type: 'integer'},
                  {name: 'startTime', type: 'text'},
                  {name: 'endTime', type: 'text'},
                  {name: 'icon', type: 'text'},
                  {name: 'desc', type: 'text'},
                  {name: 'track', type: 'integer'},
                  {name: 'experiencelevel', type: 'text'},
              ]
            },
            {
              name: 'speakers',
              columns: [
                  {name: 'id', type: 'integer primary key'},
                  {name: 'name', type: 'text'},
                  {name: 'desgn', type: 'text'},
                  {name: 'desc', type: 'text'},
                  {name: 'fname', type: 'text'},
                  {name: 'lname', type: 'text'},
                  {name: 'org', type: 'text'},
                  {name: 'prof_img', type: 'text'},
              ]
            },
            {
              name: 'sessionSpeakers',
              columns: [
                  {name: 'sessionId', type: 'integer'},
                  {name: 'speakerId', type: 'integer'},
              ]
            },
            {
              name: 'tracks',
              columns: [
                  {name: 'id', type: 'integer primary key'},
                  {name: 'title', type: 'text'},
                  {name: 'image', type: 'text'},
              ]
            },
            {
              name: 'rooms',
              columns: [
                  {name: 'id', type: 'integer primary key'},
                  {name: 'name', type: 'text'},
                  {name: 'desc', type: 'text'},
                  {name: 'image', type: 'text'},
              ]
            },
            {
              name: 'bookmarks',
              columns: [
                  {name: 'id', type: 'integer primary key'},
                  {name: 'userid', type: 'integer'},
                  {name: 'type', type: 'text'},
                  {name: 'itemId', type: 'integer'},
              ]
            },
            {
              name: 'files',
              columns: [
                  {name: 'id', type: 'integer primary key'},
                  {name: 'sessionId', type: 'integer'},
                  {name: 'fileUrl', type: 'text'},
              ]
            },
            ,
            {
              name: 'rating',
              columns: [
                  {name: 'id', type: 'integer primary key'},
                  {name: 'sessionId', type: 'integer'},
                  {name: 'UserId', type: 'integer'},
                  {name: 'ratevalue', type: 'integer'},
              ]
            },
        ]
    });
