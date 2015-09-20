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
  template: 'destination_map'
});
Router.route('/set_dest', {
  template: "destination_setter"
});

//setup mongoDBs
tourist_collection = new Mongo.Collection("tourists");
guide_collection = new Mongo.Collection("guides");


if (Meteor.isClient) {
  
  Meteor.subscribe('tourists');
  Meteor.subscribe('guides');

  Meteor.startup(function(){
    GoogleMaps.load({
      key: 'AIzaSyAHtGRa7hABkvM7povLtOTXgxyantNO7-o',
      libraries: 'places'
    });
  });

  Markers = new Mongo.Collection("map_markers");

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

  Template.destination_map.helpers({
    mapOptions: function(){
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(38.6272, -90.1978),
          zoom: 8,
          disableDefaultUI:true
        };
      }
    }
  });
  Template.destination_map.rendered = function() {
    this.autorun(function() {
      if(GoogleMaps.loaded()) {
        $('#destination_add').geocomplete();
      }
    });
  }
  Template.destination_map.onCreated(function(){
    GoogleMaps.ready('destination_map', function(map) {
      google.maps.event.addListener(map.instance, 'click', function(event) {
        Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });
      var markers = {};

      Markers.find().observe({  
        added: function(document) {
          // Create a marker for this document
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            // We store the document _id on the marker in order 
            // to update the document within the 'dragend' event below.
            id: document._id
          });
        }
      });
    });
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
