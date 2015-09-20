
if (Meteor.isClient) {
  // This code only runs on the client
  Template.matches.helpers({
    tasks: [
      { text: "google.com" },
      { text: "dongle"},
      { text: "dang"}
    ]
  });
}

