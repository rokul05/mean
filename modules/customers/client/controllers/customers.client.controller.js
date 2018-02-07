(function () {
  'use strict';

  // Customers controller
  angular
    .module('customers')
    .controller('CustomersController', CustomersController);

  CustomersController.$inject = ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'CustomersService', 'Notify', 'Presets', 'UploadFileService'];

  function CustomersController ($scope, $state, $stateParams, $location, Authentication, Customers, Notify, presets, upload) {

    var vm = this;
    vm.customer = {};
    $scope.file = {};
    $scope.authentication = Authentication;
    $scope.customers = Customers.query();
//    $scope.image = '/modules/customers/client/img/bohdan.jpg';
    $scope.image = $scope.customer.image;
    $scope.presets = presets;

    $scope.changeChannel = function(){

    };

/*
    $scope.customersCount = Customers.countCustomers(function(data) {
      $scope.customersCount = data;
      console.log('Virtual customers ', $scope.customersCount);
    });*/
/*
    $scope.selectFile = function() {
      var fileTypes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png'];
      fileDialog.selectFile(function(file) {
 //       vm.customer.image = file;
        $scope.image = file;
        $scope.contentType = 'image/jpeg';
        console.log('selected file:', file);
        if($scope.customer) {
          $scope.customer.image.data = $scope.image;
          $scope.customer.image.contentType = $scope.contentType;
        }
      }, fileTypes);
    };

*/
//    $scope.customers = angular.copy(Customers);

    // Create new customer
//    $scope.create = function (isValid) {
    $scope.create = function (isValid, listMode) {
      $scope.error = null;

      if($scope.customer._id) {
        return $scope.update(isValid);
      }
     
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'customerForm');

        return false;
      }
      // Create new customer object

      var customer = new Customers({
        firstName: this.customer.firstName,
        surname: this.customer.surname,
/*        image: { 
          data: {},
          contentType: ''
        },*/
        suburb: this.customer.suburb,
        country: this.customer.country,
        industry: this.customer.industry,
        email: this.customer.email,
        phone: this.customer.phone,
        referred: this.customer.referred,
        channel: this.customer.channel
      });
      
      // Redirect after save
      customer.$save(function (response) {
        Notify.sendMsg('NewCustomer', { 'id': response._id });
        if(listMode === 'icon') {
          $state.go('customers.listicon');
        }
        else {
          $state.go('customers.list');
        }
        
        $scope.ok();
//        $location.path('customers/' + response._id);

        // Clear form fields
        $scope.customer.firstName = '';
        $scope.customer.surname = '';
 //       $scope.customer.image = {};
        $scope.customer.suburb = '';
        $scope.customer.country = '';
        $scope.customer.industry = '';
        $scope.customer.email = '';
        $scope.customer.phone = '';
        $scope.customer.referred = '';
        $scope.customer.channel = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing customer
    $scope.remove = function (customer) {
      if (customer) {
        customer.$remove();

        for (var i in $scope.customers) {
          if ($scope.customers[i] === customer) {
            $scope.customers.splice(i, 1);
          }
        }
      } else {
        $scope.customer.$remove(function () {
          $location.path('customers');
        });
      }
    };

    // Update existing customer
    $scope.update = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'customerForm');
        return false;
      }

      var customer = $scope.customer;
      $scope.saveFile = upload.saveImage($scope.file).then(function(data) {
        console.log('DATA image', data);
        $scope.customer.image = data.data.file.destination + data.data.file.filename;
//        var image = data.data.file.destination + data.data.file.filename;
//        $scope.customer.image = image.substr(1);        
        $scope.customerSave(customer);
      });
    };

    $scope.customerSave = function(customer) {
      customer.$update(function () {
        $scope.ok();
 //       $state.go('customers.listicon');
      }, function (errorResponse) {
        console.log('Error to update customer',customer);
   //    $scope.error = errorResponse.data.message;
      });
    };


    $scope.close = function () {
      $scope.update('true');
    };


    // Find existing Article
    $scope.findOne = function () {
      $scope.customer = Customers.get({
        customerId: $stateParams.customerId
      });
    };

  }
}());
