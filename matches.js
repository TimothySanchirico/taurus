
if (Meteor.isClient) {
  // This code only runs on the client
  Template.matches.helpers({
    tasks: function () {
      return guide_collection.find({});
    }
  });
}

