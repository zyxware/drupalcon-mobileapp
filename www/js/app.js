// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'ngStorage', 'ngCordova', 'starter.config','ng.group'])

  .run(function ($ionicPlatform, $cordovaSQLite, DB_CONFIG) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      // db = $cordovaSQLite.openDB({ name: "my.db" });
      if (window.cordova) {
        db = $cordovaSQLite.openDB({name: DB_CONFIG.name}); //device
      } else {
        db = window.openDatabase(DB_CONFIG.name, '1', 'd_conference', 1024 * 1024 * 100); // browser
      }


      angular.forEach(DB_CONFIG.tables, function (table) {
        //Temporary code to drop the existing table. TO BE REMOVED.
        //var query = 'DROP TABLE ' + table.name;
        //$cordovaSQLite.execute(db, query);
        var columns = [];

        angular.forEach(table.columns, function (column) {
          columns.push(column.name + ' ' + column.type);
        });

        var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
        $cordovaSQLite.execute(db, query);
      });

    });
  })
  .factory('readJson', function ($http) {
    return {
      get: function () {
        return $http.get('json/DrupalCon_JsonData_v1.json');

      }
    }
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

  .state('app.sessions', {
    url: '/sessions',
    views: {
      'menuContent': {
        templateUrl: 'templates/sessions.html',
        controller: 'ProgramCtrl',
      }
    }
  })

  .state('app.speakers', {
      url: '/speakers',
      views: {
        'menuContent': {
          templateUrl: 'templates/speakers.html'
        }
      }
    })
  .state('app.rooms', {
      url: '/rooms',
      views: {
        'menuContent': {
          templateUrl: 'templates/rooms.html',
          controller: 'RoomsCtrl',
        }
      }
    })
    .state('app.tracks', {
      url: '/tracks',
      views: {
        'menuContent': {
          templateUrl: 'templates/tracks.html',
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/sessions');
});
