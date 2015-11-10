#Auth0 + Meteor Seed
============================

Meteor's sample (TODO APP) using Auth0 as external login service

#Running the example

In order to run the example you need to have `meteor` installed.

~~~
git clone https://github.com/auth0/meteor-auth0.git
~~~

> update settings.json with your auth0 Domain, Client ID and Client Secret.

> add http://localhost:3000/_oauth/auth0 to your Auth0 Allowed Callback URLs.

~~~
cd meteor-auth0-sample
meteor
~~~

> Go to the app running at http://localhost:3000/ and log in.


### Credits
Original sample made following Meteor's TODO App tutorial. (https://www.meteor.com/tutorials/blaze/creating-an-app)