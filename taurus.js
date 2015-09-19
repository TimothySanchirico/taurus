Router.route('/Hello', {
  template: 'Hello'
});
Router.route('/goodbye', {
  template: 'goodbye'
});
Router.route('/', {
  template: 'landingPage'
});
Router.route('/guide', {
  template: 'tourguideSignUp'
});
Router.route('/tourist', {
  template: 'touristSignUp'
});


if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);


  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.goodbye.events({
    'click button': function () {
      // increment the counter when button is clicked
      Meteor.loadTemplate('hello');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
