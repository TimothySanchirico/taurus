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
Router.route('/map', {
  template: 'mapTemplate'
});

//setup mongoDBs
tourist_collection = new Mongo.Collection("tourists");
guide_collection = new Mongo.Collection("guides");


if (Meteor.isClient) {
  console.log("Debug Line 21")
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
      //alert(locations + " " + interests);
      var touristguide_locations_array = locations.split(",");
      var touristguide_interests_array = interests.split(",");
      guide_collection.insert({
          name: { first: event.target.guide_first.value, last: event.target.guide_last.value },
          touristguide_locations: touristguide_locations_array,
          touristguide_interests_array: touristguide_interests_array,
          createdAt: new Date()
        });

      event.target.guide_first.value = "";
      event.target.guide_last.value = "";
      event.target.guide_dest.value = "";
      event.target.guide_interest.value = "";

    }
  });

  Template.touristSignUp.events({
    'submit .tourist_form': function (event) {
      event.preventDefault();

      //grab the form data
      var name = event.target.tourist_first.value + ' ' + event.target.tourist_last.value;

      //@TODO parse locations and interests into arrays of individual locations / interests
      var locations = event.target.tourist_dest.value;
      var interests = event.target.tourist_interest.value;
      var tourist_locations_array = locations.split(",");
      var tourist_interests_array = interests.split(",");
      //push these into the tourist database
      tourist_collection.insert({
          name: { first: event.target.tourist_first.value, last: event.target.tourist_last.value },
          tourist_locations: tourist_locations_array,
          tourist_interests_array: tourist_interests_array,
          createdAt: new Date()
        });

      event.target.tourist_first.value = "";
      event.target.tourist_last.value = "";
      event.target.tourist_dest.value = "";
      event.target.tourist_interest.value = "";

      Session.set('name', name);

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
