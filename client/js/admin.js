Template.admin.onCreated(function () {
    var self = this;
    self.currentPassword = new ReactiveVar(0);
    self.iamadmin = new ReactiveVar(false);

    self.selectedUser = new ReactiveVar("");

    self.localtime = new ReactiveVar(0);
    self.interval = Meteor.setInterval(function () {
        self.localtime.set(Random.id());
    }, 1000);

    self.limit = 100;
    self.inquiriesLimit = new ReactiveVar(this.limit);

    self.previousScrollTop = new ReactiveVar(0);
});

Template.admin.helpers({
    timeAgo: function (time) {
        moment.locale('ko');
        return Template.instance().localtime.get() && moment(time).fromNow();
    },
    listInquiries: function () {

        var inquiries =  Inquiry.find(
            {},
            {
                sort: {
                    createdAt: 1
                }
            }
        );

        var result = [];

        if (inquiries) {
            inquiries.forEach(function (doc) {
                if (result.indexOf(doc.username) === -1) {
                    result.push(doc.username);
                }
            });
        }

        return result;
    },
    more: function () {
        return Template.instance().inquiriesLimit.get() <= Inquiry.find({}).count();
    },
    listSingleInquries: function () {
        var username = Template.instance().selectedUser.get();

        console.log("\n\nusername : " + username);
        console.log(typeof username + "\n\n");
        console.dir(username);

        if (username === "") return [];

        var inquries =  Inquiry.find(
            {
                username: username
            },
            {
                sort: {
                    createdAt: 1
                }
            }
        );

        return inquries || [];
    },
    changeColor: function (checked) {
        return checked ? "color: black;" : "color: red";
    },
    iamadmin: function () {
        return Template.instance().iamadmin.get();
    }
});

Template.admin.onRendered(function () {
    var self = this;

    self.autorun(function () {
        self.subscribe("AdminListInquiries", self.currentPassword.get(), self.inquiriesLimit.get(), function() {
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });

    self.autorun(function () {
        self.subscribe("AdminSingleUserInquiries", self.currentPassword.get(), self.selectedUser.get(), function () {

        });
    });
});

Template.admin.events({
    "submit #admin-check-form" : function (e, t) {
        e.preventDefault();

        var password = t.find("#password").value;

        t.currentPassword.set(password);

        Meteor.call("IamAdmin", password, function (err, res) {
            if (!err) {
                if (res) {
                    t.iamadmin.set(true);
                } else {

                }
            } else {

            }
        });
    },
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    },
    "click #more" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit + t.inquiriesLimit.get();

        t.inquiriesLimit.set(newLimit);
    },
    "click .usernames" : function (e, t) {
        e.preventDefault();

        t.selectedUser.set(this + "");
    },
    "click .check-to-true": function (e, t) {
        e.preventDefault();

        Meteor.call("checkToTrue", t.currentPassword.get(), this._id, function (err, res) {
            if (!err) {
                if (res) {
                    sAlert.success("제대로 성공하셨습니다.",
                        {
                            effect: '',
                            timeout: 1000,
                            onRouteClose: false,
                            stack: false
                        });
                } else {
                    sAlert.error("그냥 실패하셨습니다.",
                        {
                            effect: '',
                            timeout: 1000,
                            onRouteClose: false,
                            stack: false
                        });
                }
            } else {
                sAlert.error("에러 발생. 실패하였습니다.",
                    {
                        effect: '',
                        timeout: 5000,
                        onRouteClose: false,
                        stack: false
                    });
            }
        });
    },
    "click #create-submit" : function (e, t) {
        e.preventDefault();

        var msg = t.find("#admin-textarea").value;
        var username = t.selectedUser.get();
        var password = t.currentPassword.get();

        Meteor.call("inquiryToUser", password, username, msg, function (err, res) {
            if (!err) {
                if (res) {
                    sAlert.success("'"+ username +"'에게 전송을 성공하였습니다.",
                        {
                            effect: '',
                            timeout: 2000,
                            onRouteClose: false,
                            stack: false
                        });
                    t.find("#admin-textarea").value = "";
                } else {
                    sAlert.error("'"+ username +"'에게 전송을 실패하였습니다.",
                        {
                            effect: '',
                            timeout: 2000,
                            onRouteClose: false,
                            stack: false
                        });
                }
            } else {
                sAlert.error("'"+ username +"'에게 전송을 실패하였습니다.",
                    {
                        effect: '',
                        timeout: 2000,
                        onRouteClose: false,
                        stack: false
                    });
            }
        });
    }
});

Template.admin.onDestroyed(function () {

});