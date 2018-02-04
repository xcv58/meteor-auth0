import { Tinytest } from 'meteor/tinytest';

import { loginHandler } from 'meteor/xcv58:auth0-lock';

// TODO: mock auth0Client.getProfile

Tinytest.add('xcv58:auth0-lock - server', (test) => {
  test.isUndefined(loginHandler({}), 'Do not handle if there is no auth0 field');

  test.isNull(
    loginHandler({ auth0: {} }), 'return null if no auth0.profile'
  );

  test.isNull(
    loginHandler({ auth0: { profile: {} } }), 'return null if no auth0.profile.user_id'
  );

  test.isNull(
    loginHandler({ auth0: { id: 'id', token: 'token' } }),
    'return null if no auth0.profile.sub'
  );
});
