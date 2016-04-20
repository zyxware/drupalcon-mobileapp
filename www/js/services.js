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
});
