angular.module('starter.services', [])

.factory('ajaxService', function ($http, $ionicLoading, $q) {
  return {
    /**
     * For ajax Services to connect to server
     * @param page
     * @param datas
     * @returns {*}
     */
    ajax: function (page, datas, headers) {
      $ionicLoading.show({
        template: '<div align="center" ><ion-spinner style="stroke:#3577E8!important"  icon="android"></ion-spinner></div>'
      });
      var deferred = $q.defer();
      return $http({
        method: 'POST',
        url: "http://dev.drupalcon.z9.dev.zyxware.net/" + page,
        headers: headers,
        data: datas
      }).success(function (data) {
        $ionicLoading.hide();
        return data;
      });
    }
  }
})
.factory('sessionService', function($q, $cordovaSQLite, $filter) {
  return {
     //factory to get the session details based on the filters.
    getSessions: function(filterKey, filterValue) {
      var q = $q.defer();
      var result = [];
      var query = "SELECT programs.id, programs.title, programs.date, programs.startTime, programs.endTime,  ";
      query += "tracks.title AS tracktitle, ";
      query += "rooms.name AS roomname, rooms.id AS roomid ";
      query += "FROM programs ";
      query += "JOIN tracks ON tracks.id = programs.track ";
      query += "JOIN rooms ON rooms.id = programs.room ";
      query += "JOIN sessionSpeakers ON sessionSpeakers.sessionId = programs.id ";
      query += "JOIN speakers ON speakers.id = sessionSpeakers.speakerId ";
      // if view-pastevents = 0, view future events only, else view past events also.
      if (window.localStorage.getItem('view-pastevents') == 0) {
        query += "WHERE programs.date > date('now') ";
      }
      else {
        query += "WHERE 1";
      }
      if( filterKey == 'date') {
        var filterValue = $filter('date')(filterValue, "yyyy-MM-dd HH:mm:ss");
        query += " AND programs.date = ?";
      }
      if( filterKey == 'room') {
        query += " AND programs.room = ?";
      }
      if( filterKey == 'track') {
        query += " AND programs.track = ?";
      }
      if( filterKey == 'speaker') {
        query += " AND sessionSpeakers.speakerId = ?";
      }
      query += " GROUP BY programs.id";
      query += " ORDER BY programs.date";
     $cordovaSQLite.execute(db, query, [filterValue]).then(function (res) {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            result.push(res.rows.item(i));
          }
          q.resolve(result);
        } else {
          //console.log("No results found");
        }
      }, function (err) {
         q.reject(null);
      });
      return q.promise;
    },
    // Get the bookmarked sessions and speakers based on the type filter.
    getFavourites: function(type) {
      var q = $q.defer();
      var result = [];
      var select = "SELECT bookmarks.id, bookmarks.type, bookmarks.itemId ";
      var from = "FROM bookmarks ";
      var where = "WHERE bookmarks.type = ?";
      var join = groupby = orderby = "";
      if (type == 'session') {
        select += ", programs.id, programs.title, programs.date, programs.startTime, programs.endTime, ";
        select += "rooms.name AS roomname, rooms.id AS roomid ";
        join += "JOIN programs ON programs.id = bookmarks.itemId ";
        join += "JOIN rooms ON rooms.id = programs.room ";
        //Checking past events filter.
        if(window.localStorage.getItem('view-pastevents') == 0) {
          where += " AND programs.date > date('now') ";
        }
        grouby = " GROUP BY programs.id";
        orderby = " ORDER BY programs.date";
      }
      else if(type == 'speaker') {
        select += ", speakers.id, speakers.name, speakers.prof_img speakers.desc, speakers.fname, speakers.lname ";
        join += "JOIN speakers ON speakers.id = bookmarks.itemId ";
      }
      var query = select + from + join + where + groupby + orderby;
      $cordovaSQLite.execute(db, query, [type]).then(function (res) {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            result.push(res.rows.item(i));
          }
          q.resolve(result);
        } else {
          //console.log("No results found");
        }
      }, function (err) {
        q.reject(null);
      });
      return q.promise;
    },
    // Get the tracks. If id is provided return the details of individual track.
    getTracks: function(id) {
      var q = $q.defer();
      var result = [];
      var query = "SELECT tracks.id, tracks.title AS name FROM tracks";
      if(id != null){
        query += " WHERE id = " + id;
      }
      else {
        query += " WHERE 1";
      }
      $cordovaSQLite.execute(db, query).then(function (res) {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            result.push(res.rows.item(i));
          }
          q.resolve(result);
        } else {
          console.log("No results found");
        }
      }, function (err) {
        q.reject(null);
      });
      return q.promise;
    },
    // Get the rooms. If id is provided return the details of individual room.
    getRooms: function(id) {
      var q = $q.defer();
      var result = [];
      var query = "SELECT id, name FROM rooms";
      if(id != null){
        query += " WHERE id = " + id;
      }
      else {
        query += " WHERE 1";
      }
      $cordovaSQLite.execute(db, query).then(function (res) {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            result.push(res.rows.item(i));
          }
          q.resolve(result);
        } else {
          console.log("No results found");
        }
      }, function (err) {
        q.reject(null);
      });
      return q.promise;
    },
    // Get the speakers. If id is provided return the details of individual speaker.
    getSpeakers: function(id) {
      var q = $q.defer();
      var result = [];
      var query = "";
      if(id != null){
        query += "SELECT id, name, desgn, desc, fname, lname, org, prof_img FROM speakers  WHERE id = " + id;
      }
      else {
        query += "SELECT id, fname, desc, lname, prof_img FROM speakers WHERE 1";
      }
      $cordovaSQLite.execute(db, query).then(function (res) {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            result.push(res.rows.item(i));
          }
          q.resolve(result);
        } else {
          console.log("No results found");
        }
      }, function (err) {
        q.reject(null);
      });
      return q.promise;
    }
  }
})

.factory('dataService', function($q, $cordovaFileTransfer) {
  return {
    getJsonFile: function () {
      var deferred = $q.defer();
      window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fileSystem) {
        fileSystem.root.getDirectory('DrupalCon/', {create: true}, function (dirEntry) {
          fileSystem.root.getDirectory('DrupalCon/json', {create: true}, function (dirUser) {
              var movieURL = "http://dev.drupalcon.z9.dev.zyxware.net/sites/default/files/sessions.json";
              var ft = new FileTransfer();
              ft.download(movieURL, dirUser.toURL() + "/sessions.json", function(entry) {
                deferred.resolve(entry);
                console.log("inside services:" + entry.nativeURL);
              }, function(err) { alert("Download failure: " + JSON.stringify(err)); });
          }, function(err) { alert("2nd getDirectory failure: " + JSON.stringify(err)); });
        }, function(err) { alert("1st getDirectory failure: " + JSON.stringify(err)); });
      }, function(err) { alert("requestFileSystem failure: " + JSON.stringify(err)); });
      return deferred.promise;
    }
  }
});
// .service('syncDataBase',function($http, $ionicLoading, $cordovaSQLite) {
//   this.syncLocaltoServer = function(table){
//     var FetchQuery = "SELECT * FROM "+table+" WHERE ";
//     $cordovaSQLite.execute(db, FetchQuery, []).then(function (resfetch) {
//       console.log(resfetch)
//       if (resfetch.rows.length > 0) {
//         for (var i = 0; i < resfetch.rows.length; i++) {
//           var data2 = resfetch.rows.item(i).ratevalue;
//           console.log(data2);
//         }
//       }
//     });
//
//   }
// })
