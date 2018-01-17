'use strict';

var DialogsService = function($uibModal, $log, $q/*, gettext*/) {
  this._uibModal = $uibModal;
  this._log = $log;
  this._q = $q;

  this._b = true; // backdrop
  this._k = true; // keyboard
  this._w = 'dialogs-default'; // windowClass
  this._bdc = 'dialogs-backdrop-default'; // backdropClass
  this._copy = true; // controls use of angular.copy
  this._wTmpl = null; // window template
  this._wSize = ''; // medium modal window default
  this._animation = true; // true/false to use animation
  this._fa = false; // fontawesome flag
  this._cancelVisible = false; // Show cancel button
  //this.gettext_ = gettext;
};

DialogsService.prototype._setOpts = function(opts) {
  var _opts = {};
  opts = opts || {};
  _opts.kb = (angular.isDefined(opts.keyboard)) ? !!opts.keyboard : this._k; // values: true,false
  _opts.bd = (angular.isDefined(opts.backdrop)) ? opts.backdrop : this._b; // values: 'static',true,false
  _opts.bdc = (angular.isDefined(opts.backdropClass)) ? opts.backdropClass : this._bdc; // additional CSS class(es) to be added to the modal backdrop
  _opts.ws = (angular.isDefined(opts.size) && ((opts.size === 'sm') || (opts.size === 'lg') || (opts.size === 'md'))) ? opts.size : this._wSize; // values: 'sm', 'lg', 'md'
  _opts.wc = (angular.isDefined(opts.windowClass)) ? opts.windowClass : this._w; // additional CSS class(es) to be added to a modal window
  _opts.anim = (angular.isDefined(opts.animation)) ? !!opts.animation : this._animation; // values: true,false
  _opts.fa = this._fa;
  _opts.cancelVisible = (angular.isDefined(opts.cancelVisible)) ? !!opts.cancelVisible : this._cancelVisible; // values: true,false
  _opts.yesLabel = (angular.isDefined(opts.yesLabel)) ? opts.yesLabel : undefined;
  _opts.noLabel = (angular.isDefined(opts.noLabel)) ? opts.noLabel : undefined;
  _opts.cancelLabel = (angular.isDefined(opts.cancelLabel)) ? opts.cancelLabel : undefined;

  return _opts;
}; // end _setOpts

/**
 * Confirm Dialog
 *
 * @param  header   string
 * @param  msg   string
 * @param  opts  object
 */
DialogsService.prototype.confirm = function(header, msg, opts) {
  opts = this._setOpts(opts);

  return this._uibModal.open({
    templateUrl: 'modules/core/client/views/dialog-confirm.html',
    controller: 'DialogsController',
    controllerAs: 'controller',
    backdrop: opts.bd,
    backdropClass: opts.bdc,
    keyboard: opts.kb,
    windowClass: opts.wc,
    size: opts.ws,
    animation: opts.anim,
    resolve:
    {
      data : function(){
        return {
          header : angular.copy(header),
          msg : angular.copy(msg),
          fa : opts.fa, /* use font-awesome */
          cancelVisible: opts.cancelVisible,
          yesLabel: opts.yesLabel,
          noLabel: opts.noLabel,
          cancelLabel: opts.cancelLabel
        };
      }
    }
  });
};

DialogsService.prototype.alert = function(header, msg, opts) {
  opts = this._setOpts(opts);

  return this._uibModal.open({
    templateUrl: 'modules/core/client/views/dialog-confirm.html',
    controller: 'DialogsController',
    controllerAs: 'controller',
    backdrop: opts.bd,
    backdropClass: opts.bdc,
    keyboard: opts.kb,
    windowClass: opts.wc,
    size: opts.ws,
    animation: opts.anim,
    resolve:
    {
      data : function(){
        return {
          header : angular.copy(header),
          msg : angular.copy(msg),
          fa : opts.fa, /* use font-awesome */
          yesVisible: false,
          noVisible: false,
          okVisible: true,
          cancelVisible: opts.cancelVisible,
          okLabel: opts.okLabel,
          cancelLabel: opts.cancelLabel
        };
      }
    }
  });
};

/**
 * Create Custom Dialog
 *
 * @param  url   string
 * @param  controller   string
 * @param  data   object
 * @param  opts  object
 */
/*
DialogsService.prototype.create = function(url, controller, controllerAs, data, opts) {
  var copy = (opts && angular.isDefined(opts.copy)) ? opts.copy : this._copy;
  opts = this._setOpts(opts);

  return this._uibModal.open({
    templateUrl : url,
    controller : controller,
    controllerAs : controllerAs,
    keyboard : opts.kb,
    backdrop : opts.bd,
    backdropClass: opts.bdc,
    windowClass: opts.wc,
    size: opts.ws,
    animation: opts.anim,
    resolve : {
      data : function() {
        if(copy)
          return angular.copy(data);
        else
          return data;
      }
    }
  }); // end modal.open
};
*/

angular.module('core')
  .service('dialogs', ['$uibModal', '$log', '$q', /*'gettext',*/ DialogsService]);
