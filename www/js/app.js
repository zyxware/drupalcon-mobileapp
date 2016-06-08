// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic','ionic.rating', 'starter.controllers', 'ngStorage', 'ngCordova', 'starter.config', 'starter.services', 'ngSanitize'])

  .run(function ($ionicPlatform, $ionicPopup, $window, $cordovaSQLite, $ionicModal, syncDataBase, DB_CONFIG, $http, $cordovaNetwork, dataService, ajaxService, $rootScope, $ionicPopup, $ionicLoading, $interval, $timeout) {

    /*
    * CHECK USER ALREADY LOGINED OR NOT
    */

    if(localStorage.getItem("userid")==''||localStorage.getItem("userid")==""||localStorage.getItem("userid")==null||localStorage.getItem("userid")=='null'||localStorage.getItem("userid")=='undefined')
    {
      $rootScope.User_id =  '';
    }else {
        $rootScope.User_id      =   localStorage.getItem("userid");
        $rootScope.username     =   localStorage.getItem("username");
    }
    //AUTOMATICALLY GET DEVICE HEIGHT AND IMPLIMENT IN FILTER PAGE SCROLLING
    var Height = ($window.innerHeight-90);
    $rootScope.InnerHeight = {"height":Height+"px"};
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
      if (window.cordova) {
        db = $cordovaSQLite.openDB({name: DB_CONFIG.name}); //device
      } else {
        db = window.openDatabase(DB_CONFIG.name, '1', 'd_conference', 1024 * 1024 * 100); // browser
      }
      var currentJsonVersion = window.localStorage.getItem('json-version');
      if (window.localStorage.getItem('db-initialized') != 1) {
        // Intializing the db for first-time.
        if(ionic.Platform.isAndroid()){
          url = "/android_asset/www/json/sessions.json";
        }
        updateDB(url);
      }
      else {
        //updating the db a/c updations in the website.
        var params = headers = [];
        // listen for Online event - on device
        var isOnline = $cordovaNetwork.isOnline();
        if(isOnline == true) {
          ajaxService.ajax('json-version', params, headers).then(function (response) {
            currentJsonVersion = response.data.version;
            if(window.localStorage.getItem('json-version') < currentJsonVersion) {
              var confirmPopup = $ionicPopup.confirm({
                title: 'Update Available',
                template: 'An update for Confernece schedule is available. Do you want to update the data?'
              });
              confirmPopup.then(function(res) {
                if(res) {
                  dataService.getJsonFile().then(function (response) {
                    var url = response.nativeURL;
                    if(window.localStorage.getItem('json-version') < currentJsonVersion) {
                      angular.forEach(DB_CONFIG.tables, function (table) {
                        if (table.name != 'bookmarks') {
                          var query = 'DROP TABLE ' + table.name;
                          $cordovaSQLite.execute(db, query);
                        }
                      });
                      updateDB(url);
                    }
                  })
                } else {
                  console.log('No need to update');
                }
              })
            }
          });
        }
      }
    });
    /**
     * Function to create the db enteries.
     *
     * @param url - path to the json file from which db is to be intilized.
     */
    var updateDB = function(url){
      $ionicLoading.show({
        template: '<div align="center" ><ion-spinner style="stroke:#3577E8!important"  icon="android"></ion-spinner></div>'
      });
      angular.forEach(DB_CONFIG.tables, function (table) {
        var columns = [];
        angular.forEach(table.columns, function (column) {
          columns.push(column.name + ' ' + column.type);
        });
        var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
        $cordovaSQLite.execute(db, query);
      });
      $http.get(url).success(function (jsonData) {
        window.localStorage.setItem('json-version', jsonData['version']);
        angular.forEach(DB_CONFIG.tables, function (table) {
          angular.forEach(jsonData[table.name], function (tableData) {
            var columns = [];
            var params = [];
            var fieldValues = [];
            angular.forEach(table.columns, function (column) {
                columns.push(column.name);
                params.push('?');
                fieldValues.push(tableData[column.name]);
            });

            var query = 'INSERT INTO ' + table.name + ' (' + columns.join(',') + ') VALUES (' + params.join(',') + ')';
            $cordovaSQLite.execute(db, query, fieldValues).then(function (res) {
            }, function (err) {
            });
          });
        });
      });
      window.localStorage.setItem('db-initialized', 1);
      $timeout( function(){ $ionicLoading.hide()}, 5000);
    }
    // An alert dialog
    $rootScope.showAlert = function(title,data) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: data
      });
    };
    /*
    *INTERVAL FUNCTION FOR SYNCHRONOUS RATING AND REVIEWS DATA
    */
    var stop = $interval(function() {
        syncDataBase.syncLocaltoServer_rating();
        syncDataBase.syncLocaltoServer_reviews();
    }, 4000);
    /*
    *MODEL POPUP FOR LOGIN
    */
    $rootScope.user = {'username':'','password':''}
    $ionicModal.fromTemplateUrl('templates/Login_model.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $rootScope.Login = modal;
    });
    $rootScope.openModal = function() {
      $rootScope.Login.show();
    };
    $rootScope.closeModal = function() {
      $rootScope.Login.hide();
    };
    /*
    *USER LOGIN FUNCTION FOR SUBMIT DATA
    */
    $rootScope.User_Login = function(user)
    {
    var isOnline = $cordovaNetwork.isOnline();
      console.log(isOnline);
     if(isOnline == true) {
        if(user.username  == '')
        {$rootScope.showAlert("Warning","Please enter your username")}
        else if(user.password == '' )
        {$rootScope.showAlert("Warning","Please enter your  password");}
        else {
            ajaxService.ajax('cod-mobile/user-authorization?uname='+user.username+'&pass='+user.password, '', []).then(function (response) {
              if(response.data.uid!=false)
              {
                localStorage.setItem("userid",response.data.uid);
                localStorage.setItem("username",user.username);
                $rootScope.username = user.username;
                $rootScope.User_id  = response.data.uid;
                $rootScope.closeModal();
              }else {
                $rootScope.showAlert("Error","Username or password is not correct");
              }
            });
        }
      }else {
        $rootScope.showAlert("Error","Please Connect Internet");
      }
    }
  })

  //CUT THE WORDS IN A PARTICULAR letters
  .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }
            return value + (tail || ' …');
        };
    })
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    //$ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left');
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    $stateProvider
  .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
  })
  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
        }
      }
   })
  .state('app.schedules', {
    url: '/schedules',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/schedules.html',
        controller: 'ScheduleCtrl',
      }
    }
  })
  .state('app.sessions', {
    url: '/sessions/:date',
    views: {
      'menuContent': {
        templateUrl: 'templates/sessions.html',
        controller: 'SessionsCtrl',
      }
    }
  })
  .state('app.sessiondetail', {
    url: '/session-detail/:sessionId',
    views: {
      'menuContent': {
        templateUrl: 'templates/sessiondetail.html',
        controller: 'SessionDetailCtrl',
      }
    }
  })
  .state('app.speakers', {
    url: '/speakers',
    views: {
      'menuContent': {
        templateUrl: 'templates/speakers.html',
        controller: 'SpeakersCtrl',
      }
    }
  })
  .state('app.speakerdetail', {
    url: '/speakerdetail/:speakerId',
    views: {
      'menuContent': {
        templateUrl: 'templates/speakerDetail.html',
        controller: 'SpeakerDetailCtrl',
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
  .state('app.roomdetail', {
    url: '/roomdetail/:roomId',
    views: {
      'menuContent': {
        templateUrl: 'templates/detail.html',
        controller: 'RoomDetailCtrl',
      }
    }
  })
  .state('app.trackdetail', {
    url: '/trackdetail/:trackId',
    views: {
      'menuContent': {
        templateUrl: 'templates/detail.html',
        controller: 'TrackDetailCtrl',
      }
    }
  })
  .state('app.tracks', {
    url: '/tracks',
    views: {
      'menuContent': {
        templateUrl: 'templates/tracks.html',
        controller: 'TracksCtrl',
      }
    }
  })
  .state('app.favourites', {
    url: '/favourites',
    views: {
      'menuContent': {
        templateUrl: 'templates/favourites.html',
        controller: 'FavouritesCtrl',
      }
    }
  })
  .state('app.favourites.sessions', {
    url: '/favourites-sessions',
    views: {
      'tab-tab1': {
        cache: false,
        templateUrl: 'templates/sessions.html',
        controller: 'FavouriteSessionsCtrl'
      }
    }
  })
  .state('app.favourites.speakers', {
    url: '/favourites-speakers',
    views: {
      'tab-tab2': {
        cache: false,
        templateUrl: 'templates/speakers.html',
        controller: 'FavouriteSpeakersCtrl'
      }
    }
  })
  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })
  .state('app.about-app', {
    url: '/about-app',
    views: {
      'menuContent': {
        templateUrl: 'templates/about-app.html'
      }
    }
  })
  .state('app.filters', {
    url: '/filters',
    views: {
      'menuContent': {
        cache: false,
        templateUrl: 'templates/filters.html',
        controller:'FilterSessions'
      }
    }
  })
  .state('app.sessionsFilter', {
    views: {
      'menuContent': {
        cache: false,
        templateUrl: 'templates/sessions.html',
        controller:'FilteredSessionsList'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
