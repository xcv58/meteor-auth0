Package.describe({
  name: 'xcv58:auth0-lock',
  version: '7.1.1',
  summary: 'Auth0 Lock for Meteor',
  git: 'https://github.com/xcv58/meteor-auth0.git',
  documentation: 'README.md',
});

Npm.depends({
  'auth0': '2.9.1',
  'events': '1.1.1',
  'util': '0.10.3',
  'auth0-lock': '11.1.2',
});

Package.onUse(function (api) {
  api.versionsFrom('1.6.1');
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
