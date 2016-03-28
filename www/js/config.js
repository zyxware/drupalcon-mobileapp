angular.module('starter.config', [])
    .constant('DB_CONFIG', {
        name: 'd_conference.db',
        tables: [
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
                  {name: 'title', type: 'text'},
                  {name: 'desc', type: 'text'},
                  {name: 'image', type: 'text'},
              ]
            },
        ]
    });
