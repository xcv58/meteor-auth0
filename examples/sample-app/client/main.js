import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Template.hello.events({
  'click button.login': function () {
    Meteor.lock.show();
  },
  'click button.logout': function () {
    Meteor.logout();
  }
});
