'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.min.css',
        'public/lib/angular-super-gallery/dist/angular-super-gallery.css'
      ],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.js',
        'public/lib/react/react.js',
        'public/lib/react/react-dom.js',
        'public/lib/ngreact/ngReact.js',
        'public/lib/react-bootstrap/react-bootstrap.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-smart-table/dist/smart-table.min.js',
        'public/lib/jquery.uniform/dist/jquery.uniform.min.js',
        'public/lib/lodash/dist/lodash.min.js',
        'public/lib/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.js',
        'public/lib/classnames/index.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/screenfull/dist/screenfull.js',
        'public/lib/angular-super-gallery/dist/angular-super-gallery.js'//,
      ]//,
//      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['public/build/templates/**/*.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
