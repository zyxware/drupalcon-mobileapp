angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


  })
  
  // ScheduleCtrl
  .controller('ScheduleCtrl', function ($scope, readJson, DB_CONFIG, $cordovaSQLite, $filter) {
    //Temporary code to initialize the local storage. TO BE REMOVED.
    //window.localStorage.setItem('db-initialized', null);
    if (window.localStorage.getItem('db-initialized') == 'null') {
      console.log(window.localStorage.getItem('db-initialized'));

      readJson.get().success(function (jsonData) {

        angular.forEach(DB_CONFIG.tables, function (table) {

          angular.forEach(jsonData[table.name], function (tableData) {

            console.log(table.name);

            var columns = [];
            var params = [];
            var fieldValues = [];

            angular.forEach(table.columns, function (column) {
              if (column.name != 'id') {
                columns.push(column.name);
                params.push('?');
                if (column.name != 'id')
                  fieldValues.push(tableData[column.name]);
              }
            });

            var query = 'INSERT INTO ' + table.name + ' (' + columns.join(',') + ') VALUES (' + params.join(',') + ')';

            $cordovaSQLite.execute(db, query, fieldValues).then(function (res) {
              console.log("INSERT ID -> " + res.insertId);
            }, function (err) {
              console.error(err);
            });
          });
        });
      });
      window.localStorage.setItem('db-initialized', 1);
    }
    var query = "SELECT * FROM eventdates WHERE 1";
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
    $scope.details = [];
    $scope.programs = [];

    sessionService.getSessions('speaker', id).then(function(response){
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
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  })

  // TracksCtrl - Tracks listing page.
  .controller('TracksCtrl', function ($scope, $cordovaSQLite) {
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
  })
  
  // TrackDetailCtrl - Track Detail page.
  .controller('TrackDetailCtrl', function ($scope, $stateParams, $cordovaSQLite, sessionService) {
    var query = "SELECT tracks.id, tracks.title AS name ";
        query += "FROM tracks WHERE id = ?";
    var id = $stateParams.trackId;
    $scope.details = [];
    $scope.programs = [];

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
    var query = "SELECT rooms.id, rooms.name, rooms.desc ";
        query += "FROM rooms WHERE id = ?";
    var id = $stateParams.roomId;
    $scope.details = [];
    $scope.programs = [];

    sessionService.getSessions('room', id).then(function(response){
      $scope.programs = response;
      //angular.forEach(response, function (res) {
        //$scope.programs.push(res.programs);
      //});
      //console.log($scope.programs);
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
    });
  });
