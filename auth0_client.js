Auth0 = {};

// Request credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on error.
Auth0.requestCredential = function (options, credentialRequestCompleteCallback) {

  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({ service: 'auth0' });

  if (!config) {
    credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError('Service not configured.'));
    return;
  }

  var state = Random.id();

  Meteor.Loader.loadJs(
    'https://d19p4zemcycm7a.cloudfront.net/w2/auth0-widget-2.4.min.js',
    function () {
      var widget = new Auth0Widget({
        domain:      config.domain,
        clientID:    config.clientId,
        callbackURL: Meteor.absoluteUrl('_oauth/auth0')
      });

      widget.signin({ extraParameters: { state: state } }, callback);
    });

  //Oauth.initiateLogin(state, loginUrl, credentialRequestCompleteCallback, { width: 900, height: 450 });
};
