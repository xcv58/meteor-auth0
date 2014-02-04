Auth0 = {};

Oauth.registerService('auth0', 2, null, function (query) {

  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);

  return {
    serviceData: {
      id:           identity.id,
      accessToken:  accessToken,
      email:        identity.contact.email
    },
    options: {
      profile: {
        firstName: identity.firstName,
        lastName: identity.lastName
      }
    }
  };
});

var userAgent = 'Meteor';
if (Meteor.release) {
  userAgent += '/' + Meteor.release;
}

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({ service: 'auth0' });
  if (!config) {
    throw new ServiceConfiguration.ConfigError('Service not configured.');
  }

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
          state:          query.state,
          client_id:      config.clientId,
          client_secret:  config.secret,
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
  else {
    return response.data.access_token;
  }
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
      'https://' + config.domain + '/userinfo', {
        headers: { 
          'User-Agent': userAgent 
        },
        params: {
          access_token: accessToken
        }
      }).data.response.user;
  }
  catch (err) {
    throw _.extend(
      new Error('Failed to fetch identity from Auth0. ' + err.message), { response: err.response });
  }
};

Auth0.retrieveCredential = function(credentialToken) {
  return Oauth.retrieveCredential(credentialToken);
};
