import { Template } from 'meteor/templating';
import { Lock } from 'meteor/xcv58:auth0-lock';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Template.hello.events({
  'click button.login': function () {
    Lock.show();
  },
  'click button.logout': function () {
    Meteor.logout();
  }
});
