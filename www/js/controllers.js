angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


  })
  
  // ProgramCtrl
  .controller('ProgramCtrl', function ($scope, readJson, DB_CONFIG, $cordovaSQLite) {
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
    $scope.eventdates = [];
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.eventdates.push(res.rows.item(i));
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

  // SpeakerCtrl - Speaker Detail page
  .controller('SpeakerCtrl', function ($scope, $stateParams, $cordovaSQLite) {
    var query = "SELECT speakers.id, speakers.name, speakers.desc, speakers.desgn ";
        query += "FROM speakers WHERE id = ?";
    var id = $stateParams.speakerId;
    $scope.speakerDtl = [];
    $cordovaSQLite.execute(db, query, [id]).then(function (res) {
      if (res.rows.length > 0) {
        $scope.speakerDtl.push(res.rows.item(0));
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  })

  // SesssionsCtrl
  .controller('SesssionsCtrl', function ($scope, $cordovaSQLite) {
    // if view-pastevents = NULL, view future events only, else view past events.
    // Temporary code to initialize the local storage. TO BE REMOVED.
    window.localStorage.setItem('view-pastevents', null);
    if (window.localStorage.getItem('view-pastevents') == 'null') {
      var query = "SELECT * FROM programs WHERE date > date('now')";
    }
    else {
      var query = "SELECT * FROM programs WHERE 1";
    }
    $cordovaSQLite.execute(db, query).then(function (res) {
      if (res.rows.length > 0) {
        $scope.programs = [];
        for (var i = 0; i < res.rows.length; i++) {
          $scope.programs.push(res.rows.item(i));
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  })

  // TracksCtrl
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
  
  // SessionCtrl
  .controller('SessionCtrl', function ($scope, $stateParams, $cordovaSQLite) {
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

  // RoomsCtrl
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
