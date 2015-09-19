//Set up routes to the different pages
Router.route('/', {
  template: 'landingPage'
});
Router.route('/guide', {
  template: 'tourguideSignUp'
});
Router.route('/tourist', {
  template: 'touristSignUp'
});

//setup mongoDBs
tourist_db = new Mongo.Collection('tourists');
guide_db = new Mongo.Collection('guides');


if (Meteor.isClient) {
  // counter starts at 0
  Meteor.subscribe('tourists');
  Meteor.subscribe('guides');
  



  Template.tourguideSignUp.events({
    'submit .guide_form': function (event) {
      event.preventDefault();
      

      //grab the form data
      var name = event.target.guide_first.value + ' ' + event.target.guide_last.value;

      //@TODO: parse locations and interests into arrays of individual locations / interests
      var locations = event.target.guide_dest.value;
      var interests = event.target.guide_interest.value;

      //push these into the guide database
      
    }
  });

  Template.touristSignUp.events({
    'submit .tourist_form': function (event) {
      

      //grab the form data
      var name = event.target.tourist_first.value + ' ' + event.target.tourist_last.value;

      //@TODO parse locations and interests into arrays of individual locations / interests
      var locations = event.target.tourist_dest.value;
      var interests = event.target.tourist_interest.value;

      //push these into the tourist database

    }
  });
}

if (Meteor.isServer) {
  //@TODO need to set up publishing ie turn off autopublish
  Meteor.publish('tourists');
  Meteor.publish('guides');

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
