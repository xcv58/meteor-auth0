if (Meteor.isClient) {

  Template.hello.events({
    'click button.login': function () {
      lock.show();
    },
    'click button.logout': function () {
      Meteor.logout();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
