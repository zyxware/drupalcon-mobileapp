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
                    {name: 'experiencelevel', type: 'text'},
                ]
            }
        ]
    });