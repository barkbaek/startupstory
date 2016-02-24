Template.about.onCreated(function () {
});

Template.about.helpers({
});

Template.about.onRendered(function () {

});

/***** 페이지 우측 상단에 로그아웃 클릭 시, 계정 로그아웃. *****/
Template.about.events({
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    }
});

Template.about.onDestroyed(function () {

});