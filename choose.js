
if (Meteor.isClient) {
  // This code only runs on the client
  // Template.ranking.helpers({
  //   rankings: function () {
  //     return formatting(rankGuides(Session.get('this_session')));

  //     // guide_collection.find({_id: rankGuides[0][0]}).fetch()[0].name.first;

  //     //return guide_collection.find({});
  //   }
  // });

Template.choose.helpers({
	tasks: [
		 {text: return_name}
	],
	phones: [
		{text: return_phone}
	],
	interests: [
		{text:return_interests}
	]
});

  Template.choose.onCreated(function(){
  	var id = Session.get('guides_id');
  	var guide_obj = guide_collection.find({_id: id}).fetch();
  	var name = guide_obj[0].name.first + ' ' + guide_obj[0].name.last;
  	$("#chosen_guide_name").val(name);
  });
  Template.choose.rendered = function(){
  	this.autorun(function() {
  		var id = Session.get('guides_id');
	  	var guide_obj = guide_collection.find({_id: id}).fetch();
	  	
	  	var name = guide_obj[0].name.first + ' ' + guide_obj[0].name.last;
	  	
	  	$("#chosen_guide_name").val(name);
	  });
  };
}

function return_name(){
	var id = Session.get('guides_id');
	  	var guide_obj = guide_collection.find({_id: id}).fetch();
	  	
	  	var name = guide_obj[0].name.first + ' ' + guide_obj[0].name.last;
	  	return name;
}
function return_phone(){
	var id = Session.get('guides_id');
	  	var guide_obj = guide_collection.find({_id: id}).fetch();
	  	
	  	var phone = guide_obj[0].phone;
	  	return phone;
}
function return_interests(){
	var id = Session.get('guides_id');
	var guide_obj = guide_collection.find({_id: id}).fetch();
	console.log(guide_obj);
	var ints = guide_obj[0].guideInt;
	var int_string = ''
	for(var i = 0; i < ints.length; i++){
		int_string = int_string + ints[i] + " ";
	}
	console.log(int_string);
	return int_string;
}

function formatting(arr ) {
	var outter_list = document.getElementById('guide_list');
	for(var i = 0; i < rankGuides.length; i++) {
		var new_element = '<li>';
		var guide = guide_collection.find({_id: rankGuides[i][0]}).fetch()[0];
		var namer = guide.name.first + " " + guide.name.last;
		new_element+=namer;
		new_element+= '</li>';
		var scorer = stringify(rankGuides[i][1]);
		var sum = namer.concat("\t\t-\t\t" + scorer);
		outter_list.innerHTML+=new_element;
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