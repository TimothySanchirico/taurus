
if (Meteor.isClient) {
  // This code only runs on the client
  Template.matches.helpers({
    tasks: function () {
      //return guide_collection.find({});
      rankGuides(Session.get('this_session'));
    }
  });
}

function rankGuides(sessionval) {
	var guideCursor = guide_collection.find();
	var tourist = tourist_collection.find({_id: sessionval}).fetch()[0];
	var rankings = new Array(0);
	var score = 0;
	var sameLoc = 0;
	guideCursor.forEach(function(guide) {
		for(var i=0; i<tourist.touristLoc.length; i++) {
			for(var j=0; j<guide.guideLoc.length; j++) {
				if(tourist.touristLoc[i] == guide.guideLoc[j])
					sameLoc = 1;
			}
		}
		if(sameLoc != 1) {
			var entry = new Array(2);
			entry[0] = guide._id;
			entry[1] = 0;
			rankings.push(entry);
		}
	});
}