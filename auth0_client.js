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
  } else if (!options) {
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({ service: 'auth0' });

  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();

  var loginUrlParameters = {};
  
  if (config.loginUrlParameters){
    _.extend(loginUrlParameters, config.loginUrlParameters)
  }

  if (options.loginUrlParameters){
    _.extend(loginUrlParameters, options.loginUrlParameters)
  }

  var popupOptions = options.popupOptions || {};

  var loginStyle = OAuth._loginStyle('auth0', config, options);
  // https://developers.google.com/accounts/docs/OAuth2WebServer#formingtheurl
  _.extend(loginUrlParameters, {
    "response_type": "code",
    "client_id":  config.clientId,
    "redirect_uri": OAuth._redirectUri('auth0', config),
    "state": OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)
  });
  var loginUrl = 'https://' + config.domain + '/authorize?' +
    _.map(loginUrlParameters, function(value, param){
      return encodeURIComponent(param) + '=' + encodeURIComponent(value);
    }).join("&");

  OAuth.launchLogin({
    loginService: "auth0",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: { height:  popupOptions.height || 450, width: popupOptions.width || 320}
  });
};
