'use strict';

var DialogsController = function($scope, $modalInstance, $timeout, data/*, utils, gettext*/) {
  this.modalInstance_ = $modalInstance;
  this.scope_ = $scope;
  this.$timeout = $timeout;
  //this.utils = utils;

  $scope.header = (angular.isDefined(data.header)) ? data.header : ''; // $translate.instant('DIALOGS_CONFIRMATION');
  $scope.msg = (angular.isDefined(data.msg)) ? data.msg : ''; // $translate.instant('DIALOGS_CONFIRMATION_MSG');
  $scope.icon = '';
    // $scope.icon = (angular.isDefined(data.fa) && angular.equals(data.fa,true)) ? 'fa fa-check' : 'glyphicon glyphicon-check';
  $scope.okVisible = angular.isDefined(data.okVisible) ? data.okVisible : false;
  $scope.cancelVisible = angular.isDefined(data.cancelVisible) ? data.cancelVisible : false;
  $scope.yesVisible = angular.isDefined(data.yesVisible) ? data.yesVisible : true;
  $scope.noVisible = angular.isDefined(data.noVisible) ? data.noVisible : true;
  $scope.yesLabel = angular.isDefined(data.yesLabel) ? data.yesLabel : 'Yes';
  $scope.noLabel = angular.isDefined(data.noLabel) ? data.noLabel : 'No';
  $scope.cancelLabel = angular.isDefined(data.cancelLabel) ? data.cancelLabel : 'Cancel';
  $scope.okLabel = angular.isDefined(data.cancelLabel) ? data.cancelLabel : 'Ok';
/*
  $scope.yesLabel = angular.isDefined(data.yesLabel) ? data.yesLabel : gettext('Yes');
  $scope.noLabel = angular.isDefined(data.noLabel) ? data.noLabel : gettext('No');
  $scope.cancelLabel = angular.isDefined(data.cancelLabel) ? data.cancelLabel : gettext('Cancel');
  $scope.okLabel = angular.isDefined(data.cancelLabel) ? data.cancelLabel : gettext('Ok');
*/
};

DialogsController.prototype.yes = function()
{
  this.modalInstance_.close('yes');
 // this.utils.cleanupModals();
};
DialogsController.prototype.no = function()
{
  this.modalInstance_.dismiss('no');
 // this.utils.cleanupModals();
};        
DialogsController.prototype.cancel = function()
{
  this.modalInstance_.dismiss('cancel');
 // this.utils.cleanupModals();
};

/* Controller injected in generic dialogs */
angular.module('core').controller('DialogsController', ['$scope', '$uibModalInstance', '$timeout', 'data'/*, 'utils', 'gettext'*/,
    DialogsController]);
