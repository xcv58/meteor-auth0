import { Template } from 'meteor/templating';
import { initLock } from 'meteor/xcv58:auth0-lock';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Template.hello.events({
  'click .login': function (event, template) {
    event.preventDefault();
    const email = template.find('#email').value;
    const allowSignUp = template.find('#allowSignUp').checked;
    const closable = template.find('#closable').checked;
    const allowShowPassword = template.find('#allowShowPassword').checked;
    const Lock = initLock({
      prefill: { email },
      allowSignUp,
      closable,
    });
    Lock.show();
  },
  'click button.logout': function () {
    Meteor.logout();
  }
});
