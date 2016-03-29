# Auth0 Meteor

## Lock

[Auth0](https://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Google Apps and Salesforce.

Lock makes it easy to integrate SSO in your app. You won't have to worry about:

* Having a professional looking login dialog that displays well on any device.
* Finding the right icons for popular social providers.
* Solving the home realm discovery challenge with enterprise users (i.e.: asking the enterprise user the email, and redirecting to the right enterprise identity provider).
* Implementing a standard sign in protocol (OpenID Connect / OAuth2 Login)

## Key features

* **Integrates** your Meteor app with **Auth0**
* Provides a **beautiful native UI** to log your users in.
* Provides support for **Social Providers** (Facebook, Twitter, etc.), **Enterprise Providers** (AD, LDAP, etc.) and **Username & Password**.
* Provides support for **Meteor accounts** so you develop your Meteor app as usual, in a clean and stright-forward way.

## Requirements

You'll need Meteor **1.2.1**.

## Install

Lock is available through [Atmosphere](https://atmospherejs.com/). To install it, simply run the following command in your project folder:

```sh
meteor add auth0:lock
```

## Before Getting Started

Create a file named `settings.json` in your project folder. This file should have your Auth0 ClientId and Domain that you can get from [our dashboard](https://app.auth0.com/#/applications).
```js
{
  "private": {
    "AUTH0_CLIENT_ID": "YOUR_CLIENT_ID",
    "AUTH0_DOMAIN": "YOUR_AUTH0_DOMAIN"
  }
}
```
Please remember to replace the respective values.

## Usage

This Meteor package gives you access to an instance of Lock that is instantiated for you and stored in the global `lock` variable. There is no need to call `new Auth0Lock(...);` since this is already done by the package.
You can call any of the Lock methods on this instance, and pass any of the options detailed in the documentation referenced below.

For example, you may call from inside a click event handler:

```js
lock.show();
// or
lock.showSignin(function(err, profile, token) { ... });
// or
lock.showSignup({...}, function(err, profile, token) { ... });
```
Any documented combination is valid.

To log out, you can just call `Meteor.logout();` if you just want to log the user out of your app.
Or you may call `lock.logout();` if you want to log the user out of the social provider, for instance, but this will redirect the user outside your app to the social provider log out site.

## Accessing User Details

To show any of the user details after logging in, you can use the `currentUser` helper in any of your Handlebar templates.
You will find the user profile under `currentUser.services.auth0`.

```html
{{> userName}}
<template name="userName">
  {{currentUser.services.auth0.name}}
</template>
```
You can access the user profile from the server through the `Meteor.user()` global getter, under the `services.auth0` object.

```js
var userName = Meteor.user().services.auth0.name;
```

## Documentation
You can find the full documentation for Lock on the [Auth0 docs site](https://auth0.com/docs/libraries/lock).

* [Complete API][lock-customization]
* [UI customization][ui-customization]
* [Single Page Applications][spa-notes] implementation notes.
* [Regular Web Applications][webapps-notes] implementing notes.
* [Overlay vs Embedded mode][display-modes]
* [Popup vs Redirect mode][authentication-modes] notes. **What are the authentication modes?**.
* [Error customization][error-customization] notes.
* [I18n][i18n-notes] notes.
* [Events][events-notes] notes.
* [Development][development-notes] notes.
* [Release process][release-process] notes.
* [Auth0Lock playground][playground-url]
* [Using Refresh Tokens][using-refresh-tokens]

## Example

The **example/auth0-meteor-sample** directory has a ready-to-go app. In order to run it you need [Meteor](https://www.meteor.com/) installed.

Then execute `meteor --settings settings.json` from the root of this project.

Finally, point your browser at `http://localhost:3000/` and play around.

## Browser Compatibility

We ensure browser compatibility in `Chrome`, `Safari`, `Firefox` and `IE >= 9`. We currently use [zuul](https://github.com/defunctzombie/zuul) along with [Saucelabs](https://saucelabs.com) to run integration tests on each push.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Publishing the package

An [Atmosphere](https://atmospherejs.com) account for Auth0 should be created under the name `auth0` to make it possible to call the package `auth0:lock` as indicated in `package.js`.
The repo has to be cloned locally, and inside the `lock` folder (package folder) the following command must be run:

```bash
meteor publish --create
```
If the `auth0` account credentials for Atmosphere were used during the Meteor installation, those credentials will be used to push the package to Atmosphere.
If they were not, then they will be asked for after the previous command is run for the first time and cached thereafter.

This will publish the package, make it available in Atmosphere as well as creating a package site there.

<!-- Vaaaaarrsss -->

[lock-initialization]: https://auth0.com/docs/libraries/lock/initialization
[lock-customization]: https://auth0.com/docs/libraries/lock/customization
[application-types]: https://auth0.com/docs/libraries/lock/types-of-applications
[display-modes]: https://auth0.com/docs/libraries/lock/display-modes
[spa-notes]: https://auth0.com/docs/libraries/lock/types-of-applications#single-page-app
[webapps-notes]: https://auth0.com/docs/libraries/lock/types-of-applications#regular-webapp
[authentication-modes]: https://auth0.com/docs/libraries/lock/authentication-modes
[popup-mode]: https://auth0.com/docs/libraries/lock/authentication-modes#popup-mode
[redirect-mode]: https://auth0.com/docs/libraries/lock/authentication-modes#redirect-mode
[ui-customization]: https://auth0.com/docs/libraries/lock/ui-customization
[error-customization]: https://auth0.com/docs/libraries/lock/customizing-error-messages
[i18n-notes]: https://auth0.com/docs/libraries/lock/i18n
[events-notes]: https://auth0.com/docs/libraries/lock/events
[development-notes]: https://github.com/auth0/lock/wiki/Development-notes
[release-process]: https://github.com/auth0/lock/wiki/Release-process
[playground-url]: http://auth0.github.com/playground
[migration-guide]: https://auth0.com/docs/libraries/lock/migration-guide
[using-refresh-tokens]: https://auth0.com/docs/libraries/lock/using-refresh-tokens

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
