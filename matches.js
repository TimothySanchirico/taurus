
if (Meteor.isClient) {
  // This code only runs on the client
  Template.ranking.helpers({
    rankings: function () {
      return formatting(rankGuides(Session.get('this_session')));

      // guide_collection.find({_id: rankGuides[0][0]}).fetch()[0].name.first;

      //return guide_collection.find({});
    }
  });
}

function formatting(arr ) {
	for(var i = 0; i < rankGuides.length; i++) {
		var guide = guide_collection.find({_id: rankGuides[i][0]}).fetch()[0];
		var namer = guide.name.first + " " + guide.name.last;
		var scorer = stringify(rankGuides[i][1]);
		var sum = namer.concat("\t\t-\t\t" + scorer);
	}

}


function rankGuides(sessionval) {
	console.log(guide_collection.find().count());
	console.log(tourist_collection.find().count());
	console.log(sessionval);
	var guideCursor = guide_collection.find();
	var tourist = tourist_collection.find({_id: sessionval}).fetch()[0];
	// console.log(tourist.name);
	var rankings = new Array(0);
	guideCursor.forEach(function(guide) {
		var score = 0;
		var sameLoc = 0;
		for(var i=0; i<tourist.touristLoc.length; i++) {
			for(var j=0; j<guide.guideLoc.length; j++) {
				if(tourist.touristLoc[i] == guide.guideLoc[j]) {
					sameLoc++;
				}
			}
		}
		if(sameLoc == 0) {
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
		console.log(guide_collection.find({_id: rankings[i][0]}).fetch()[0].name.first + "\t" + rankings[i][1]);
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