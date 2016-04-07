Package.describe({
  name: 'xcv58:auth0-lock',
  version: '6.0.2',
  summary: 'Auth0 Lock for Meteor',
  git: 'https://github.com/xcv58/meteor-auth0.git',
  documentation: 'README.md',
});

Npm.depends({
  'events': '1.1.0',
  'util': '0.10.3',
  'auth0-lock': '10.0.0-beta.1',
});

Package.onUse(function (api) {
  api.versionsFrom('1.3');
  api.use(['ecmascript', 'accounts-base', 'accounts-oauth', 'underscore']);
  api.mainModule('auth0-lock-server.js', 'server');
  api.mainModule('auth0-lock-client.js', 'client');
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('xcv58:auth0-lock');
  api.mainModule('tests/server.js', 'server');
  api.mainModule('tests/client.js', 'client');
});
