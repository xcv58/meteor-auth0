if (Meteor.isClient) {
    this.lock = {};
    self      = this;
    Meteor.startup(function () {
        Meteor.call('getAuth0Attributes', function (error, res) {
            // Instantiate lock as soon as the getAuth0Attributes Meteor method
            // returns.
            self.lock = new _Auth0Lock(res.AUTH0_CLIENTID, res.AUTH0_DOMAIN);


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
    function _addAccountsCallback(arguments) {
        if (arguments.length === 0) {
            // No options or a callback
            [].push.call(arguments, _getCallbackWrapper());
        } else if (arguments.length === 1) {
            // Just one argument. Could be an options object or a callback function.
            if (_.isFunction(arguments[0])) {
                // It's a function. Gets replaced with our callback wrapper.
                arguments[0] = _getCallbackWrapper(arguments[0]);
            } else {
                // It's not a function. Our callback wrapper is added to the arguments array.
                [].push.call(arguments, _getCallbackWrapper());
            }
        } else if (arguments.length > 1) {
            // More than one argument. Usual case when an options object and a callback is passed to show()
            for (var i = 0; i++; i < arguments.length) {
                if (_.isFunction(arguments[i])) {
                    // We found the callback function. Gets replaced with our callback wrapper and we are done.
                    arguments[i] = _getCallbackWrapper(arguments[i]);
                    break;
                }
            }
        }
    }
}
