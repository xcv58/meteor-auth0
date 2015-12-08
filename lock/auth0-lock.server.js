if (Meteor.isServer) {
    // Calculate the absolute path for the app
    var _getAppPath = function(){
        // On Windows the tokenizer must include a backslash
        if (process.platform === 'win32' || process.platform === 'win64') {
          return __meteor_bootstrap__.serverDir.split('\\.meteor')[0] + '\\';
        }
        return __meteor_bootstrap__.serverDir.split('/.meteor')[0] + '/';
    };

    // Load the .env file
    Npm.require('dotenv').load({path: _getAppPath() + '.env'});

    // Register the Auth0 login handler for Meteor.
    Accounts.registerLoginHandler(function (options) {
        if (!options.auth0)
            return undefined; // Do not handle

        if (!_.contains(Accounts.oauth.serviceNames(), 'auth0')) {
            // If the auth0 service was removed from serviceConfiguration
            return {
                type : "auth0",
                error: new Meteor.Error(
                    Accounts.LoginCancelledError.numericError,
                    "No registered oauth service found for: Auth0")
            }
        }

        // Do nothing if the profile is not received.
        if (!options.auth0.profile || !options.auth0.profile.user_id)
            return null;

        // Accounts.updateOrCreateUserFromExternalService 
        // expects the unique user id to be stored in the 'id'
        // property of serviceData.
        options.auth0.profile.id = options.auth0.profile.user_id;

        // Run the Accounts method to store the profile and 
        // optional data (token) in Meteor users collection.
        return Accounts.updateOrCreateUserFromExternalService("auth0", options.auth0.profile, options.auth0.token);
    });

    // Send the user details to the client. Complete profile when logged in user,
    // only id and name to all other users. This data is stored in the local users collection.
    // It is created or updated locally when logging in.
    Accounts.addAutopublishFields({
        forLoggedInUser: ['services.auth0'],
        forOtherUsers: [
            'services.auth0.id', 'services.auth0.name'
        ]
    });

    // Publish server methods
    Meteor.methods({
        // Sends the Auth0 account attributes to the client upon request.
        // Gets called from the Meteor.startup function on the client.
        'getAuth0Attributes': function () {
            return {
                AUTH0_CLIENTID: process.env.AUTH0_CLIENT_ID,
                AUTH0_DOMAIN  : process.env.AUTH0_DOMAIN
            };
        }
    });
}
