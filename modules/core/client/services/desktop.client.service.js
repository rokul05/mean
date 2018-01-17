'use strict';

DesktopApplicationService.$inject = ['$rootScope', '$http', '$state', 'desktopMode'];
function DesktopApplicationService($rootScope, $http, $state, desktopMode) {
  this.enabled = desktopMode;

  if (this.enabled) {
    document.body.addClass('desktop');
  }

  this.closeApplication = function() {
    if (this.enabled) {
      // Get the current window
      var win = require('nw.gui').Window.get();
      win.close();
    }
    else {
      console.error('closeApplication() function only available in desktop mode.');
    }
  }.bind(this);

  this.openFileFromDisk = function(callback) {
    console.debug('# Open from disk');
    var chooser = '#_header_openfile_dialog';
    chooser.unbind('change');
    chooser.val('');
    chooser.change(function(evt) {
      var filepath = this.val();
      $rootScope.$apply(function() {
        if (callback) {
          callback(filepath);
        }
      });
    });

    chooser.trigger('click');  
  // 

  }.bind(this);

  this.saveFileToDisk = function(callback) {
    var chooser = '#_header_savefile_dialog';
    chooser.unbind('change');
    chooser.val('');
    chooser.change(function(evt) {
      var filepath = this.val();
      $rootScope.$apply(function() {
        if (callback) {
          callback(filepath);
        }
      });
    });

    chooser.trigger('click');  

  }.bind(this);

  this.commandLineParameters = function() {
    if (!this.enabled) {
      return null;
    }

    return require('nw.gui').App.argv;
  }.bind(this);

  this.validate = function() {
    var commandLine = this.commandLineParameters;
    return $http.post('/api/auth/desktop');
  };
}

angular.module('core')
  .service('DesktopApplication', DesktopApplicationService);
