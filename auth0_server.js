Auth0 = {};

Oauth.registerService('auth0', 2, null, function (query) {

  var accessToken = getAccessToken(query);
  var user = getUserProfile(accessToken);

  return {
    serviceData: {
      accessToken: accessToken,
      id: user.user_id,
      email: user.email,
      name: user.name || user.email
    },
    options: {
      profile: {
        name: user.name
      }
    }
  };
});

var userAgent = 'Meteor';
if (Meteor.release) {
  userAgent += '/' + Meteor.release;
}

var getAccessToken = function (query) {
  var config = getConfiguration();
  var response;
  try {

    response = HTTP.post(
      'https://' + config.domain + '/oauth/token', {
        headers: {
          Accept: 'application/json',
          'User-Agent': userAgent
        },
        params: {
          code:           query.code,
          //state:          query.state,
          client_id:      config.clientId,
          client_secret:  config.clientSecret,
          grant_type:     'authorization_code',
          redirect_uri:   Meteor.absoluteUrl('_oauth/auth0')
        }
      });
  }
  catch (err) {
    throw _.extend(
      new Error('Failed to complete OAuth handshake with Auth0. ' + err.message), { response: err.response });
  }

  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error('Failed to complete OAuth handshake with Auth0. ' + response.data.error);
  } 
  
  return response.data.access_token;
};

var getUserProfile = function (accessToken) {
  var config = getConfiguration();
  var response;
  try {
    response = HTTP.get(
      'https://' + config.domain + '/userinfo', {
        headers: {
          'User-Agent': userAgent 
        },
        params: {
          access_token: accessToken
        }
      });
  }
  catch (err) {
    throw _.extend(
      new Error('Failed to fetch user profile from Auth0. ' + err.message), { response: err.response });
  }

  return response.data;
};

var getConfiguration = function () {
  var config = ServiceConfiguration.configurations.findOne({ service: 'auth0' });
  if (!config) {
    throw new ServiceConfiguration.ConfigError('Service not configured.');
  }
  return config;
};

Auth0.retrieveCredential = function(credentialToken) {
  return Oauth.retrieveCredential(credentialToken);
};
