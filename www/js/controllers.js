angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicSideMenuDelegate) {
    if (window.localStorage.getItem('view-pastevents') == 0) {
      $scope.pastevents = false;
    }
    else {
      $scope.pastevents = true;
    }
    $scope.viewPastEvents = function() {
      window.localStorage.setItem('view-pastevents', 1);
      $scope.pastevents = true;
      $ionicSideMenuDelegate.toggleLeft(false);
    };
    $scope.removePastEvents = function() {
      window.localStorage.setItem('view-pastevents', 0);
      $scope.pastevents = false;
      $ionicSideMenuDelegate.toggleLeft(false);
    };
  })

  // ScheduleCtrl
  .controller('ScheduleCtrl', function ($scope, DB_CONFIG, $cordovaSQLite) {

    var query = "SELECT date FROM eventdates ";
    // if view-pastevents = 0, view future events only, else view past events.
    console.log(window.localStorage.getItem('view-pastevents'));
    if (window.localStorage.getItem('view-pastevents') == 0) {
      query += "WHERE date > date('now') ";
    }
    else {
      console.log('inside else');
      query += "WHERE 1";
    }
    $scope.schedules = [];
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          var dateStr = res.rows.item(i).date;
          var dateVal = new Date(dateStr).getTime();
          $scope.schedules.push({dateStr:dateStr, dateVal:dateVal});
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  })

  // SpeakersCtrl - Speaker listing page
  .controller('SpeakersCtrl', function ($scope, $cordovaSQLite) {
    var query = "SELECT * FROM speakers WHERE 1";
    $scope.speakers = [];
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.speakers.push(res.rows.item(i));
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  })

  // SpeakerDetailCtrl - Speaker Detail page
  .controller('SpeakerDetailCtrl', function ($scope, $stateParams, $cordovaSQLite, sessionService) {
    var query = "SELECT speakers.id, speakers.name, speakers.desc, speakers.desgn ";
        query += "FROM speakers WHERE id = ?";
    var id = $stateParams.speakerId;
    //$scope.detail = [];
    $scope.programs = [];

    sessionService.getSessions('speaker', id).then(function(response){
      $scope.programs = response;
    });

    $cordovaSQLite.execute(db, query, [id]).then(function (res) {
      if (res.rows.length > 0) {
        $scope.detail = res.rows.item(0);
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
    
    $scope.bookmarked = false;
    var bookQuery = "SELECT bookmarks.id FROM bookmarks WHERE type = ? AND itemId = ?";
    $cordovaSQLite.execute(db, bookQuery, ['speaker', id]).then(function (resBook) {
      if (resBook.rows.length > 0) {
        $scope.bookmarked = true;
      }
    });
  })

  // SessionsCtrl - Session listing Page
  .controller('SessionsCtrl', function ($scope, sessionService, $stateParams) {
    
    var date = $stateParams.date;
    $scope.programs = [];

    sessionService.getSessions('date', date).then(function(response){
      $scope.programs = response;
    });
  })

  // SessionDetailCtrl - Session Detail Page
  .controller('SessionDetailCtrl', function ($scope, $stateParams, $cordovaSQLite) {
    var id = $stateParams.sessionId;
    var query = "SELECT programs.*, tracks.title AS tracktitle, ";
        query += "speakers.name AS speakername, speakers.id AS speakerid, ";
        query += "rooms.name AS roomname, rooms.id AS roomid ";
        query += "FROM programs ";
        query += "JOIN tracks ON tracks.id = programs.track ";
        query += "JOIN rooms ON rooms.id = programs.room ";
        query += "JOIN sessionSpeakers ON sessionSpeakers.sessionId = programs.id ";
        query += "JOIN speakers ON speakers.id = sessionSpeakers.speakerId ";
        query += " WHERE programs.id = ?";

    $scope.program = [];
    $scope.speakers = [];

    $cordovaSQLite.execute(db, query, [id]).then(function (res) {
      if (res.rows.length > 0) {
        $scope.program = res.rows.item(0);
        $scope.programDate = new Date(res.rows.item(0).date);
        for (var i = 0; i < res.rows.length; i++) {
          var speakerId = res.rows.item(i).speakerid;
          var speakername = res.rows.item(i).speakername;
          $scope.speakers.push({speakername:speakername,speakerid:speakerId});
        }
        $scope.bookmarks = false;
        var bookQuery = "SELECT bookmarks.id FROM bookmarks WHERE type = ? AND itemId = ?";
        $cordovaSQLite.execute(db, bookQuery, ['session', id]).then(function (resBook) {
          if (resBook.rows.length > 0) {
            $scope.bookmarked = true;
          }
        });
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  })

  // TracksCtrl - Tracks listing page.
  .controller('TracksCtrl', function ($scope, $cordovaSQLite) {
    var query = "SELECT tracks.id, tracks.title FROM tracks WHERE 1";
    $scope.tracks = [];
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.tracks.push(res.rows.item(i));
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  })
  
  // TrackDetailCtrl - Track Detail page.
  .controller('TrackDetailCtrl', function ($scope, $stateParams, $cordovaSQLite, sessionService) {
    var query = "SELECT tracks.id, tracks.title AS name ";
        query += "FROM tracks WHERE id = ?";
    var id = $stateParams.trackId;
    $scope.details = [];
    $scope.programs = [];
    $scope.pageTitle = "Tracks";
    sessionService.getSessions('track', id).then(function(response){
      $scope.programs = response;
    });

    $cordovaSQLite.execute(db, query, [id]).then(function (res) {
      if (res.rows.length > 0) {
        $scope.details.push(res.rows.item(0));
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  })

  // RoomDetailCtrl - Room Detail page
  .controller('RoomDetailCtrl', function ($scope, $stateParams, $cordovaSQLite, sessionService) {
    var query = "SELECT rooms.id, rooms.name ";
        query += "FROM rooms WHERE id = ?";
    var id = $stateParams.roomId;
    $scope.details = [];
    $scope.programs = [];
    $scope.pageTitle = "Rooms";
    sessionService.getSessions('room', id).then(function(response){
      $scope.programs = response;
    });
    
    $cordovaSQLite.execute(db, query, [id]).then(function (res) {
      if (res.rows.length > 0) {
        $scope.details.push(res.rows.item(0));
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  })

  // RoomsCtrl - Rooms listing page.
  .controller('RoomsCtrl', function ($scope, $cordovaSQLite) {
    var query = "SELECT id, name FROM rooms WHERE 1";
    $scope.rooms = [];
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.rooms.push(res.rows.item(i));
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    })
  })

  // BookmarkCtrl - Bookmarking items
  .controller('BookmarkCtrl', function ($scope, $cordovaSQLite) {
    $scope.addBookmark = function(type, id) {
      var query = 'INSERT INTO bookmarks (type, itemId) VALUES ( ?, ?)';
      $cordovaSQLite.execute(db, query, [type, id]).then(function (res) {
        $scope.bookmarked = true;
      }, function (err) {
          console.error(err);
      });
    };

    $scope.removeBookmark = function(type, id) {
      var query = 'DELETE FROM bookmarks WHERE type = ? AND itemId = ?';
      $cordovaSQLite.execute(db, query, [type, id]).then(function (res) {
        $scope.bookmarked = false;
      }, function (err) {
          console.error(err);
      });
    }
  })

  // FavouritesCtrl - Displays favourites
  .controller('FavouritesCtrl', function ($scope, $cordovaSQLite) {

  })

  // FavouriteSessionsCtrl - Displays favourite sessions
  .controller('FavouriteSessionsCtrl', function ($scope, $cordovaSQLite, sessionService) {
    $scope.$on('$ionicView.afterEnter', function() {
      $scope.programs = [];
      sessionService.getFavourites('session').then(function(response){
        $scope.programs = response;
      });
    });

  })

  // FavouriteSpeakersCtrl - Displays favourite speakers
  .controller('FavouriteSpeakersCtrl', function ($scope, $cordovaSQLite, sessionService) {
    $scope.$on('$ionicView.afterEnter', function() {
      $scope.speakers = [];
      sessionService.getFavourites('speaker').then(function(response){
        $scope.speakers = response;
      });
    });
  })
  
  // FilterSessions - Filters sessions
  .controller('FilterSessions', function ($scope, $cordovaSQLite, sessionService, $state, $rootScope, $ionicHistory) {
    
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $rootScope.dateFilter = [];
    $rootScope.trackFilter = [];
    $rootScope.roomFilter = [];
    
    // Intializing the date filter. Getting the eventdates.
    var query = "SELECT date FROM eventdates ";
    // if view-pastevents = 0, view future events only, else view past events.
    console.log(window.localStorage.getItem('view-pastevents'));
    if (window.localStorage.getItem('view-pastevents') == 0) {
      query += "WHERE date > date('now') ";
    }
    else {
      query += "WHERE 1";
    }
    $scope.schedules = [];
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          var dateStr = res.rows.item(i).date;
          var dateVal = new Date(dateStr).getTime();
          $scope.schedules.push({dateStr:dateStr, dateVal:dateVal});
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
    
    // Intializing the date filter
    $scope.dateToggle = true;
    // Intializing the track filter. Getting the tracks.
    var query = "SELECT * FROM tracks WHERE 1";
    $scope.tracks = [];
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.tracks.push(res.rows.item(i));
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });

    // Intializing the room filter. Getting rooms list.
    var query = "SELECT * FROM rooms WHERE 1";
    $scope.rooms = [];
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.rooms.push(res.rows.item(i));
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    })

    // Show/hide the filter values  according to the active div
    $scope.toggleFilter = function(type) {
      $scope.dateToggle = false;
      $scope.trackToggle = false;
      $scope.roomToggle = false;
      
      if(type == 'date') {
        $scope.dateToggle = true;
      }
      if(type == 'track') {
        $scope.trackToggle = true;
      }
      if(type == 'room') {
        $scope.roomToggle = true;
      }
    }

    // Setting the values for datefilter, with values listed in filter page.
    $rootScope.dateFilter = [];
    
    $scope.setDateFilter = function(date) {
      var idx = $rootScope.dateFilter.indexOf(date);
      
      if(idx > -1) {
        $rootScope.dateFilter.splice(idx, 1);
      }
      else {
        $rootScope.dateFilter.push(date);
      }
    }

    // Setting the values for track, with values listed in filter page.
    $rootScope.trackFilter = [];
    
    $scope.setTrackFilter = function(date) {
      var idx = $rootScope.trackFilter.indexOf(date);
      
      if(idx > -1) {
        $rootScope.trackFilter.splice(idx, 1);
      }
      else {
        $rootScope.trackFilter.push(date);
      }
    }

    // Setting the values for rooms, with values listed in filter page.
    $rootScope.roomFilter = [];
    
    $scope.setRoomFilter = function(date) {
      var idx = $rootScope.roomFilter.indexOf(date);
      
      if(idx > -1) {
        $rootScope.roomFilter.splice(idx, 1);
      }
      else {
        $rootScope.roomFilter.push(date);
      }
    }

    $scope.applyFilter = function() {
      console.log($rootScope.trackFilter);
      console.log($rootScope.roomFilter);
      $state.go('app.sessionsFilter');
    };

    $scope.clearFilter = function() {
      console.log($rootScope.trackFilter);
      console.log($rootScope.roomFilter);
      $rootScope.dateFilter = [];
      $rootScope.trackFilter = [];
      $rootScope.roomFilter = [];
      $scope.dateVal = false;
      $scope.trackVal = false;
      $scope.roomVal = false;
    };
  })

  // FilteredSessionsList - Displays sessions after filtering
  .controller('FilteredSessionsList', function ($scope, $rootScope, $filter, $cordovaSQLite) {
    var query = "SELECT programs.id, programs.title, programs.date, programs.startTime, programs.endTime,  ";
    query += "tracks.title AS tracktitle, ";
    query += "rooms.name AS roomname, rooms.id AS roomid ";
    query += "FROM programs ";
    query += "JOIN tracks ON tracks.id = programs.track ";
    query += "JOIN rooms ON rooms.id = programs.room ";
    query += "JOIN sessionSpeakers ON sessionSpeakers.sessionId = programs.id ";
    query += "JOIN speakers ON speakers.id = sessionSpeakers.speakerId ";
    // if view-pastevents = 0, view future events only, else view past events.
    if (window.localStorage.getItem('view-pastevents') == 0) {
      query += "WHERE programs.date > date('now') ";
    }
    else {
      query += "WHERE 1 ";
    }
    var filterValue = [];
    if($rootScope.dateFilter.length > 0) {
      query += "AND (";
      for (var i = 0; i < $rootScope.dateFilter.length; i++) {
        filterValue = $filter('date')($rootScope.dateFilter[i], "yyyy-MM-dd HH:mm:ss");
        query += "programs.date = '" + filterValue + "'";  //;
        if(i != $rootScope.dateFilter.length -1) {
          query += " OR ";
        }
      }
      query += ")";
    }
    if( $rootScope.trackFilter.length > 0) {
      query += " AND programs.track IN (" + $rootScope.trackFilter + ")";
    }
    if( $rootScope.roomFilter.length > 0) {
      query += " AND programs.room IN (" + $rootScope.roomFilter + ")";
    }
    query += "GROUP BY programs.id";
    $scope.programs = [];
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.programs.push(res.rows.item(i));
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
    $scope.appliedFilter = true;
  });

