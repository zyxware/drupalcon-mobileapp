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
        angular.forEach(res.rows,function(programData){
          console.log(programData);
          $scope.programs.push(programData);
        });
      } else {
        //console.log("No results found");
      }
    }, function (err) {
      //console.error(err);
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
          //console.log(res.rows.item(i));
        }
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  });
