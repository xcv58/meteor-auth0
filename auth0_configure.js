Template.configureLoginServiceDialogForAuth0.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForAuth0.fields = function () {
  return [
    { property: 'domain', label: 'Domain'},
    { property: 'clientId', label: 'Client ID'},
    { property: 'clientSecret', label: 'Client Secret'}
  ];
};
