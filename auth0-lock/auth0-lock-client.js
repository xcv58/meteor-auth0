import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Auth0Lock from 'auth0-lock/lib/classic';

import './auth0-lock-common';

const { AUTH0_CLIENT_ID, AUTH0_DOMAIN } = Meteor.settings.public;

let Lock = null;

if (AUTH0_CLIENT_ID && AUTH0_DOMAIN) {
  Lock = new Auth0Lock(
    AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
      auth: { redirect: false },
      avatar: null,
      autoclose: true,
    }, (err, res) => {
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

  const hash = Lock.parseHash();
  if (hash) {
    // Login is redirect. Profile should be handled here.
    if (hash.error) {
      // TODO: handle error
      // console.log("There was an error logging in... ", hash.error);
    } else {
      Lock.getProfile(hash.id_token, (err, profile, token) => {
        if (err) {
          // TODO: handle error
          // console.log('Cannot get user :(', err);
          return;
        }

        const auth0 = { profile, token };
        Accounts.callLoginMethod({ methodArguments: [{ auth0 }] });
      });
    }
  }

  Lock.logout = () => {
    Meteor.logout();
  };

  Meteor.lock = Lock;
}

export { Lock };
