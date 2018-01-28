import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';
import { AuthenticationClient } from 'auth0';

const { AUTH0_CLIENT_ID, AUTH0_DOMAIN } = Meteor.settings.public;

const auth0Client = new AuthenticationClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
});

import './auth0-lock-common';

export const loginHandler = (options = {}) => {
  const { auth0 } = options;
  if (!auth0) {
    // Do not handle
    return undefined;
  }

  if (!_.contains(Accounts.oauth.serviceNames(), 'auth0')) {
    // If the auth0 service was removed from serviceConfiguration
    return {
      type: 'auth0',
      error: new Meteor.Error(
        Accounts.LoginCancelledError.numericError,
        'No registered oauth service found for: Auth0'
      ),
    };
  }

  const { accessToken } = auth0;
  // Do nothing if the profile is not received.
  if (!accessToken) {
    return null;
  }
  const getProfile = Meteor.wrapAsync(auth0Client.getProfile, auth0Client);
  try {
    const profile = getProfile(accessToken);
    // Accounts.updateOrCreateUserFromExternalService
    // expects the unique user id to be stored in the 'id'
    // property of serviceData.
    return Accounts.updateOrCreateUserFromExternalService(
      'auth0', Object.assign(profile, { id: profile.sub }), auth0
    );
  } catch (err) {
    throw Object.assign(
      new Error(`Failed to complete OAuth handshake with Auth0. ${err.message}`),
      { response: err.response }
    );
  }
};

Accounts.registerLoginHandler(loginHandler);

// Send the user details to the client. Complete profile when logged in user,
// only id and name to all other users. This data is stored in the local users collection.
// It is created or updated locally when logging in.
Accounts.addAutopublishFields({
  forLoggedInUser: ['services.auth0'],
  forOtherUsers: ['services.auth0.id', 'services.auth0.name'],
});
