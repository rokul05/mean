(function () {
  'use strict';

  angular
    .module('core')
    .service('Presets', PresetsService);

  PresetsService.$inject = [/*'gettext'*/];

  function PresetsService(/*gettext*/) {

    var vm = {};

    vm.channels = [
      {
        label: 'Choose Channel',
        value: 'no'
      },     
      {
        value: false
      },     
      {
        label: 'Facebook',
        value: 'facebook'
      }, 
      {
        label: 'Twitter',
        value: 'twitter'
      }, 
      {
        label: 'Email',
        value: 'email'
      }
    ];

    vm.filterList = [
      {
        label: 'Facebook',
        value: 'facebook'
      }, 
      {
        label: 'Twitter',
        value: 'twitter'
      }, 
      {
        label: 'Email',
        value: 'email'
      },
      { 
        value: false
      }, 
      { 
        label: 'Show all',
        value: 'all'
      }
    ];


    return vm;

  }
})();
