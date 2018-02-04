import { Tinytest } from 'meteor/tinytest';

import { Lock, initLock } from 'meteor/xcv58:auth0-lock';

// TODO: Unit test try Sinon.JS
Tinytest.add('xcv58:auth0-lock - client', (test) => {
  test.isTrue(Boolean(Lock), 'Lock is null or undefined');
  test.isTrue(typeof initLock === 'function', 'initLock is a function');
});
