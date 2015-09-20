
if (Meteor.isClient) {
  // This code only runs on the client
  Template.matches.helpers({
    tasks: function () {
      return rankGuides(Session.get('this_session'));
    }
  });
}

function rankGuides(sessionval) {
	console.log(sessionval);
	var guideCursor = guide_collection.find();
	var tourist = tourist_collection.find({_id: sessionval}).fetch()[0];
	var rankings = new Array(0);
	guideCursor.forEach(function(guide) {
		var score = 0;
		var sameLoc = 0;
		for(var i=0; i<tourist.touristLoc.length; i++) {
			for(var j=0; j<guide.guideLoc.length; j++) {
				if(tourist.touristLoc[i] == guide.guideLoc[j])
					sameLoc = 1;
			}
		}
		if(sameLoc != 1) {
			var entry = new Array(2);
			entry[0] = guide._id;
			entry[1] = score;
			rankings.push(entry);
		}
		else {
			score += sameLoc;
			for(var i=0; i<tourist.touristInt.length; i++) {
				for(var j=0; j<guide.guideInt.length; j++) {
					if(tourist.touristInt[i] == guide.guideInt[j])
						score++;
				}
			}
			var entry = new Array(2);
			entry[0] = guide._id;
			entry[1] = score;
			rankings.push(entry);
		}
	});
	rankings.sort(sortFunction);
	for(var i=0; i<rankings.length; i++)
	{
		console.log(rankings[i][0] + "\t" + rankings[i][1]);
	}
	return rankings;
}

function sortFunction(a, b) {
	if(a[1] == b[1]) {
		return 0;
	}
	else {
		return (a[0] < b[0]) ? -1 : 1;
	}
}