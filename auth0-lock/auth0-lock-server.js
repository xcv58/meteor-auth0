import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';

import './auth0-lock-common';

export const loginHandler = (options) => {
  if (!options.auth0) {
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

  // Do nothing if the profile is not received.
  if (!options.auth0.profile || !options.auth0.profile.user_id) {
    return null;
  }

  // Accounts.updateOrCreateUserFromExternalService
  // expects the unique user id to be stored in the 'id'
  // property of serviceData.
  const { profile } = options.auth0;
  profile.id = profile.user_id;

  // Run the Accounts method to store the profile and
  // optional data (token) in Meteor users collection.
  return Accounts.updateOrCreateUserFromExternalService(
    'auth0', options.auth0.profile, options.auth0.token
  );
};

Accounts.registerLoginHandler(loginHandler);

// Send the user details to the client. Complete profile when logged in user,
// only id and name to all other users. This data is stored in the local users collection.
// It is created or updated locally when logging in.
Accounts.addAutopublishFields({
  forLoggedInUser: ['services.auth0'],
  forOtherUsers: ['services.auth0.id', 'services.auth0.name'],
});
