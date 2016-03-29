if (Meteor.isClient) {
    Meteor.lock = {};
    self      = Meteor;
    Meteor.startup(function () {
        Meteor.call('getAuth0Attributes', function (error, res) {
            // Instantiate lock as soon as the getAuth0Attributes Meteor method
            // returns.
            if (!res.AUTH0_CLIENTID || !res.AUTH0_DOMAIN) {
              return;
            }
            self.lock = new _Auth0Lock(res.AUTH0_CLIENTID, res.AUTH0_DOMAIN);

            var hash = self.lock.parseHash();
            if (hash) {
                //Login is redirect. Profile should be handled here.
                if (hash.error) {
                    console.log("There was an error logging in... ", hash.error);
                } else {
                    self.lock.getProfile(hash.id_token, function(err, profile, token) {
                        if (err) {
                            console.log('Cannot get user :(', err);
                            return;
                        }

                        Accounts.callLoginMethod({
                            methodArguments: [{
                                auth0: {
                                    profile: profile,
                                    token  : token
                                }
                            }]
                        });
                    });
                }
            }

            // Replace lock functions that need special handling by Meteor and its accounts system
            var show = self.lock.show;
            self.lock.show = function() {
                _addAccountsCallback(arguments);
                return show.apply(this, arguments); // Call show with the processed arguments array.
            };
            var showSignin = self.lock.showSignin;
            self.lock.showSignin = function() {
                _addAccountsCallback(arguments);
                return showSignin.apply(this, arguments); // Call showSignin with the processed arguments array.
            };
            var showSignup = self.lock.showSignup;
            self.lock.showSignup = function() {
                _addAccountsCallback(arguments);
                return showSignup.apply(this, arguments); // Call showSignup with the processed arguments array.
            };
            var showReset = self.lock.showReset;
            self.lock.showReset = function() {
                _addAccountsCallback(arguments);
                return showReset.apply(this, arguments); // Call showSignup with the processed arguments array.
            };
            var logout = self.lock.logout;
            self.lock.logout = function() {
                Meteor.logout(); // Call Meteor.logout as part of the logout process
                return logout.apply(this, arguments); // Just call logout right away.
            }
        });
    });

    // Constructs the callback that Lock show,showSignin,
    // showLogin,etc. methods can take,
    // and use this to call the Accounts.callLoginMethod,
    // so the profile and token both sent to
    // the Meteor account system.
    var _getCallbackWrapper = function(userCallback) {
        return function (err, profile, token){
            // Call Accounts from within the package
            Accounts.callLoginMethod({
                methodArguments: [{
                    auth0: {
                        profile: profile,
                        token  : token
                    }
                }]
            });

            if (_.isFunction(userCallback)) // Call the user provided callback from the original call
                userCallback(err, profile, token);
        }
    };

    // Adds our callback wrapper to the arguments array
    function _addAccountsCallback(args) {
        if (args.length === 0) {
            // This means redirect, so there is no need to do a callback.
            // No options or a callback
            // [].push.call(args, _getCallbackWrapper());
        } else if (args.length === 1) {
            // Just one argument. Could be an options object or a callback function.
            if (_.isFunction(args[0])) {
                // It's a function. Gets replaced with our callback wrapper.
                args[0] = _getCallbackWrapper(args[0]);
            } else {
                // It's not a function. The options object will get to our lock instance.
                // This means redirect, so there is no need to do a callback.
                // It's not a function. Our callback wrapper is added to the arguments array.
                // [].push.call(args, _getCallbackWrapper());
            }
        } else if (args.length > 1) {
            // More than one argument. Usual case when an options object and a callback is passed to show()
            for (var i = 0; i++; i < args.length) {
                if (_.isFunction(args[i])) {
                    // We found the callback function. Gets replaced with our callback wrapper and we are done.
                    args[i] = _getCallbackWrapper(args[i]);
                    break;
                }
            }
        }
    }
}
