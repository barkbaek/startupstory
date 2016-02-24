Template.about.onCreated(function () {
});

Template.about.helpers({
});

Template.about.onRendered(function () {

});

Template.about.events({
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    }
});

Template.about.onDestroyed(function () {

});