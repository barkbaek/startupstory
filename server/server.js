Meteor.startup(function () {

    if (Meteor.users.find({}).count() === 0) {
        Accounts.createUser({
            username: "admin",
            password: "1234"
        });
    }

    Accounts.config({
        forbidClientAccountCreation: true
    });

    Meteor.users.deny({
        insert: function (userId, doc) {
            return true;
        },
        update: function (userId, doc, fields, modifier) {
            return true;
        },
        remove: function (userId, doc) {
            return true;
        }
    });

    Meteor.publish("ListArticles", function(limit) {
        return Articles.find(
            {},
            {
                fields: {
                    'isPublic': 1,
                    'type': 1,
                    'title': 1,
                    'count': 1,
                    'totalCommenters': 1,
                    'createdAt': 1
                },
                sort: {
                    createdAt: -1
                },
                limit: limit
            }
        );
    });

    Meteor.publish("FrontListComments", function(limit) {
        return Comments.find(
            {},
            {
                fields: {
                    'articleId': 1,
                    'username': 1,
                    'comment': 1,
                    'createdAt': 1
                },
                sort: {
                    createdAt: -1
                },
                limit: limit
            }
        );
    });

    Meteor.publish("ListInquiries", function(limit) {
        if (!this.userId) {
            this.ready();
        } else {
            return Inquiry.find(
                {
                    userId: this.userId
                },
                {
                    sort: {
                        createdAt: -1
                    },
                    limit: limit
                }
            );
        }
    });

    Meteor.publish("ListComments", function (articleId, limit) {
        return Comments.find(
            {
                articleId: articleId
            },
            {
                sort: {
                    createdAt: -1
                },
                limit: limit
            }
        );
    });

    Meteor.publish("AdminListInquiries", function (password, limit) {
        if (password !== "1234") {
            console.log("AdminListInquiries - password failed");
            this.ready();
        } else {
            console.log("AdminListInquiries - password succeded");
            return Inquiry.find(
                {
                    checked: false
                },
                {
                    sort: {
                        createdAt: 1
                    },
                    limit: limit
                }
            );
        }
    });

    Meteor.publish("AdminSingleUserInquiries", function (password, username) {
        if (password !== "1234") {
            console.log("AdminSingleUserInquiries - password failed");
            this.ready();
        } else {
            console.log("AdminSingleUserInquiries - password succeded");
            return Inquiry.find(
                {
                    username: username
                },
                {
                    sort: {
                        createdAt: 1
                    }
                }
            );
        }
    });
});