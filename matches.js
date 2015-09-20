
if (Meteor.isClient) {
  // This code only runs on the client
  Template.matches.helpers({
    tasks: function () {
      return guide_collection.find({});
      touristScoreCalc(Session.get('this_session'));
    }
  });
}

function rankGuides(sessionval) {
	var guideCursor = guide_collection.find({});
	console.log(guideCursor);
	var guide;
	var tourist = tourist_collection.find({_id: sessionval}).fetch();
	var rankings = new Array(0);
	while(guideCursor.hasNext()) {
		guide = guideCursor.next().fetch();
	}
}