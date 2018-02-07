(function () {
  'use strict';

  angular.module('customers')
    .service('UploadFileService', UploadFileService);

  UploadFileService.$inject = ['$http'];

  function UploadFileService($http) {
    this.saveImage = function(file) {
      var fd = new FormData();
      fd.append('myImage', file.upload);
      return $http.post('api/customers/saveFile', fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      });
    };
  }
}());
