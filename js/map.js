// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });
}




var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
Template.body.helpers({
    function initialize() {
      var stlouis = { lat: 38.6272, lng: -90.1978 };
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: stlouis
      });

      // This event listener calls addMarker() when the map is clicked.
      google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, map);
      });

      // Add a marker at the center of the map.
      addMarker(stlouis, map);
    }

    // Adds a marker to the map.
    function addMarker(location, map) {
      // Add the marker at the clicked location, and add the next-available label
      // from the array of alphabetical characters.
      var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
      });
    }

    google.maps.event.addDomListener(window, 'load', initialize);
});