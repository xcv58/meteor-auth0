import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Auth0Lock from 'auth0-lock';

import './auth0-lock-common';

const { AUTH0_CLIENT_ID, AUTH0_DOMAIN } = Meteor.settings.public;

export const initLock = (options = {}) => {
  if (!AUTH0_CLIENT_ID || !AUTH0_DOMAIN) {
    throw new Meteor.Error('No AUTH0_CLIENT_ID or AUTH0_DOMAIN!');
  }
  const finalOptions = Object.assign({
    auth: {
      redirect: true,
    },
    avatar: null,
    autoclose: true,
    allowAutocomplete: true,
    closable: false,
    loginAfterSignUp: true,
  }, options);

  const Lock = new Auth0Lock(
    AUTH0_CLIENT_ID, AUTH0_DOMAIN, finalOptions, (err, res) => {
      if (err) {
        // TODO: handle error
      } else {
        const { accessToken, profile } = res;
        Accounts.callLoginMethod({
          methodArguments: [{
            auth0: { profile, token: accessToken },
          }],
        });
      }
    }
  );

  Lock.on('authorization_error', (error) => {
    Lock.show({
      flashMessage: {
        type: 'error',
        text: error.error_description,
      },
    });
  });

  Lock.on('authenticated', (authResult) => {
    const { accessToken } = authResult;
    Lock.getUserInfo(authResult.accessToken, (error, profile) => {
      // Login is redirect. Profile should be handled here.
      if (error) {
        // TODO: handle error
        console.error('There was an error logging in... ', error);
        return;
      }

      const auth0 = { profile, token: accessToken };
      Accounts.callLoginMethod({ methodArguments: [{ auth0 }] });
    });
  });

  Lock.logout = () => {
    Meteor.logout();
  };

  return Lock;
};

export const Lock = initLock();
