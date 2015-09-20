
if (Meteor.isClient) {
  // This code only runs on the client
  Template.matches.helpers({
    tasks: function () {
      return guide_collection.find({});
      tourGuideScoreCalc(Session.get('this_session'));
      if(Session.get('type') == "tourist") {
      	guideScoreCalc(Session.get('this_session'));
      }
      else
      {
      	touristScoreCalc(Session.get('this_session'));
      }
    }
  });
}

function guideScoreCalc(sessionval) {
  var touristCursor = tourist_collection.find({});
  console.log(touristCursor);
  var tourist;
  var guide = guide_collection.find({_id: sessionval}).fetch();
  var orderedOutput = new Array(0);
  while(touristCursor.hasNext()) {
    tourist = touristCursor.next().fetch();
 
  }
}

function touristScoreCalc(sessionval) {
	
}