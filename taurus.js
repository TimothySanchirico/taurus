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
Router.route('/matches', {
  template: "matches"
});

    tourist_collection = new Mongo.Collection("tourists");
    guide_collection = new Mongo.Collection('guides');
    Markers = new Mongo.Collection("map_markers");

if (Meteor.isClient) {
  
  Meteor.startup(function(){
    Meteor.subscribe('tourists');
    Meteor.subscribe('guides');
    Meteor.subscribe('map_markers');
    guide_collection.allow({
      'insert':function(){
      return true;
      } 
    });
    tourist_collection.allow({
      'insert':function()
      {
        return true;
      }
    });
    Markers.allow({
      'insert':function(){
        return true;
      }
    });

    GoogleMaps.load({
      key: 'AIzaSyAHtGRa7hABkvM7povLtOTXgxyantNO7-o',
      libraries: 'places'
    });
  });

  

  Template.tourguideSignUp.events({
    'submit .guide_form': function (event) {
      event.preventDefault();

      //@TODO: parse locations and interests into arrays of individual locations / interests
      var locations = event.target.guide_dest.value;
      var interests = event.target.guide_interest.value;

      //push these into the guide database
      //alert(locations + " " + interests);
      var guideLocArr = formatString(locations);
      var guideIntArr = formatString(interests);
      var guide_phone = event.target.guide_contact.value;
      var insert_obj = {
        name: {
          first: event.target.guide_first.value,
          last: event.target.guide_last.value
        },
        guideLoc: guideLocArr, 
        guideInt: guideIntArr, 
        phone:guide_phone, 
        createdAt:new Date()
      };
      console.log(insert_obj);
      guide_collection.insert(insert_obj, function(error){
          if(error){
            console.log(error);
          }
          else {
            console.log("insert success");
          }
        });
      var id = guide_collection.find().fetch()[0]._id;
      Session.set('this_session', id);
      Session.set('type', "guide");
      event.target.guide_first.value = "";
      event.target.guide_last.value = "";
      event.target.guide_dest.value = "";
      event.target.guide_interest.value = "";
      Router.go('map')
    }
  });

  Template.touristSignUp.events({
    'submit .tourist_form': function (event) {
      event.preventDefault();

      //@TODO parse locations and interests into arrays of individual locations / interests
      var locations = event.target.tourist_dest.value;
      var interests = event.target.tourist_interest.value;
      
      var touristLocArr = formatString(locations);
      var touristIntArr = formatString(interests);
      //push these into the tourist database
      tourist_collection.insert({
          name: { 
            first: event.target.tourist_first.value, 
            last: event.target.tourist_last.value 
          },
          touristLoc: touristLocArr,
          touristInt: touristIntArr,
          createdAt: new Date()
        });

      var id = tourist_collection.find().fetch()[0]._id;
      Session.set('this_session', id);
      Session.set('type', "tourist");
      event.target.tourist_first.value = "";
      event.target.tourist_last.value = "";
      event.target.tourist_dest.value = "";
      event.target.tourist_interest.value = "";
      Router.go('matches');
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
        $('#destination_add')
          .geocomplete()
          .bind("geocode:result", function(event, result){
            lat = result.geometry.location.H;
            lng = result.geometry.location.L;
            //THIS IS THE MARKER THAT NEEDS TO GO IN MARKERS DB
            tour_guide_name = Session.get('guide_name');
            console.log(tour_guide_name);
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              map: dest_map,
              title: "Destinationz"
            });
            Marker.insert(marker, function(error){
              if(error){
                console.log(error);
              }
              else {
                console.log("Markers insert success");
              }
            });
            $('#destination_add').val('');
          });
      }
    });

      
  };
  Template.destination_map.onCreated(function(){
    GoogleMaps.ready('destination_map', function(map) {
      dest_map = map.instance;
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

  // Template.destination_map.events({
  //   'submit .dest_add_form': function(event){

  //   }
  // });
}

function formatString(str) {
  var delimited = str.split(/\,\s+|\s+|\,+/g);
  for(var i=0; i<delimited.length; i++)
    delimited[i] = delimited[i].toLowerCase();
  return delimited;
}

if (Meteor.isServer) {
  //@TODO need to set up publishing ie turn off autopublish
  
  

  Meteor.startup(function () {
    // code to run on server at startup
    //setup mongoDBs
    

    
    Meteor.publish('tourists', function () {
      return tourist_collection.find(); // everything
    });
    Meteor.publish('guides', function() {
      return guide_collection.find();
    });
    Meteor.publish('map_markers', function(){
      return Markers.find();
    });

    guide_collection.allow({
      'insert':function(){
        return true;
      }
    
    });

    tourist_collection.allow({
      'insert':function()
      {
        return true;
      }
    });

    Markers.allow({
      'insert':function(){
        return true;
      }
    });

  });
}
