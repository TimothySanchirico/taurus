
if (Meteor.isClient) {
  // This code only runs on the client
  Template.ranking.helpers({
    'rankings': function () {
	    return formatter(rankGuides(Session.get('this_session')));
    },
    'ids':function() {
    	id_array = [];
    	id_ranks =rankGuides(Session.get('this_session'))
    	for(var i = 0; i < id_ranks.length; i++){
    		console.log("ID:");
    		console.log(id_ranks[i][0]);
    		id_array.push(id_ranks[i][0]);
    	}
    	return id_array;
    }

    
  });

  Template.ranking.events({
  	'click .matched_guide_list': function(e){
  		guides_id = e.toElement.outerText;
  		console.log("GUIDES ID LEAVING MATCHES")
  		console.log(guides_id);
  		Session.set('guides_id', guides_id);
  		Router.go('/choose');
  		
  	}
  });
}

function formatter(twodarr) {
	var out = new Array(0);
	for(var i=0; i<twodarr.length; i++) {
		out.push(subformatter(twodarr[i][0], twodarr[i][1]));
	}
	return out;
}

function subformatter(sessionval, score)
{
	var guide = guide_collection.find({_id: sessionval}).fetch()[0];
	var name = guide.name.first + " " + guide.name.last;
	var out = name + "\t\t\t" + score;
	return out;
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
		return (a[1] < b[1]) ? 1 : -1;
	}
}