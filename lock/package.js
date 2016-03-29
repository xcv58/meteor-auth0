'use strict';

Package.describe({
    name         : 'xcv58:auth0-lock',
    version      : '0.5.0',
    summary      : 'Auth0 Lock for Meteor',
    git          : 'https://github.com/auth0/meteor-auth0.git',
    documentation: 'README.md'
});

Npm.depends({
    "auth0-lock": "9.0.0",
    "brfs"      : "1.4.3",
    "ejsify"    : "0.1.0",
    "packageify": "0.2.0"
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use(['ecmascript', 'accounts-base', 'accounts-oauth']);
    api.use(['underscore'], 'server');
    api.use(['cosmos:browserify@0.9.2'], 'client');
    api.addFiles(['auth0-lock.browserify.js', 'auth0-lock.js'], 'client');
    api.addFiles(['auth0-lock.server.js'], 'server');
    api.addFiles(['auth0-lock.common.js']);

    api.export('lock', 'client');
});
