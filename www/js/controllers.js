angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


  })
  .controller('ProgramCtrl', function ($scope, readJson, DB_CONFIG,$cordovaSQLite) {

    if (window.localStorage.getItem('db-initialized') == 'null') {
      console.log(window.localStorage.getItem('db-initialized'));

      readJson.get().success(function (jsonData) {

        angular.forEach(DB_CONFIG.tables, function (table) {

          angular.forEach(jsonData[table.name], function(tableData){

            //console.log(jsonData[table.name]);

            var columns = [];
            var params = [];
            var fieldValues = [];


            angular.forEach(table.columns, function (column) {
              if(column.name != 'id' ) {
                columns.push(column.name);
                params.push('?');
                if(column.name != 'id' )
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

    //$scope.select = function (lastname) {
    //  var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
    //
    //  $cordovaSQLite.execute(db, query, [lastname]).then(function (res) {
    //    if (res.rows.length > 0) {
    //      console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
    //    } else {
    //      console.log("No results found");
    //    }
    //  }, function (err) {
    //    console.error(err);
    //  });
    //}

  });

// .controller('JsonController', function($scope, $stateParams) {
//     console.log('hello');
// });