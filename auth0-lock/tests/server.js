import { Tinytest } from 'meteor/tinytest';

import { loginHandler } from 'meteor/xcv58:auth0-lock';

  // if (!options.auth0.profile || !options.auth0.profile.user_id) {

Tinytest.add('xcv58:auth0-lock - server', (test) => {
  test.isUndefined(loginHandler({}), 'Do not handle if there is no auth0 field');

  const auth0 = {};
  test.isNull(loginHandler({ auth0 }), 'return null if no auth0.profile');

  auth0.profile = {};
  test.isNull(loginHandler({ auth0 }), 'return null if no auth0.profile.user_id');

  auth0.profile = { user_id: 'id', token: 'token' };
  test.isNotNull(loginHandler({ auth0 }), 'return null if no auth0.profile.user_id');
});
