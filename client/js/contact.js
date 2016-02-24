Template.contact.onCreated(function () {
    var self = this;

    self.localtime = new ReactiveVar(0);
    self.interval = Meteor.setInterval(function () {
        self.localtime.set(Random.id());
    }, 1000);

    self.limit = 20;
    self.inquiriesLimit = new ReactiveVar(this.limit);

    self.previousScrollTop = new ReactiveVar(0);
});

Template.contact.helpers({
    timeAgo: function (time) {
        moment.locale('ko');
        return Template.instance().localtime.get() && moment(time).fromNow();
    },
    listInquiries: function () {
        return Inquiry.find(
            {},
            {
                sort: {
                    createdAt: 1
                }
            }
        );
    },
    more: function () {
        return Template.instance().inquiriesLimit.get() <= Inquiry.find({}).count();
    }
});

Template.contact.onRendered(function () {
    var self = this;

    self.autorun(function () {
        self.subscribe("ListInquiries", self.inquiriesLimit.get(), function() {
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });
});

Template.contact.events({
    "click #contact-more" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit + t.inquiriesLimit.get();

        t.inquiriesLimit.set(newLimit);
    },
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    },
    "click #create-submit": function (e, t) {
        e.preventDefault();

        var msg = t.find("#contact-textarea").value;

        Meteor.call("inquiryToAdmin", msg, function (err, res) {
            if (!err) {
                if (res) {
                    t.find("#contact-textarea").value = "";
                } else {

                }
            } else {

            }
        });
    }
});

Template.contact.onDestroyed(function () {

});