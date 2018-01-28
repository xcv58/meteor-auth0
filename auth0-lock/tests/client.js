import { Tinytest } from 'meteor/tinytest';

import { Lock } from 'meteor/xcv58:auth0-lock';

// TODO: Unit test try Sinon.JS
Tinytest.add('xcv58:auth0-lock - client', (test) => {
  test.isFalse(Boolean(Lock), 'Lock is null or undefined');
  test.isUndefined(Lock, 'Lock is null');
});
