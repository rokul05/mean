'use strict';

module.exports = {
  // Development assets
  client: {
    jsx: [
      'modules/*/client/**/*.jsx'
    ]
  },
  server: {
    protectedJS: [
 //     '**/*.protected.js',
      'config/lib/app.js',
  //    'config/lib/utils.js',
      'modules/users/server/controllers/users/users.authentication.server.controller.js',
    ]
  }

};
