Package.describe({
  summary: 'Auth0 Login flow',
  internal: true
});

Package.on_use(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  api.use('external-file-loader', 'client');

  api.export('Auth0');

  api.add_files(['auth0_configure.html', 'auth0_configure.js'], 'client');
  api.add_files('auth0_server.js', 'server');
  api.add_files('auth0_client.js', 'client');
});
