Template.front.onCreated(function () {
    console.log("front onCreated");

    var self = this;

    self.localtime = new ReactiveVar(0);
    self.interval = Meteor.setInterval(function () {
        self.localtime.set(Random.id());
    }, 1000);

    /* 게시물용 */
    self.limit = 20;
    self.articlesLimit = new ReactiveVar(this.limit);

    /* 힘 보태주기용 */
    self.limit2 = 20;
    self.commentsLimit = new ReactiveVar(this.limit2);

    self.previousScrollTop = new ReactiveVar(0);

    self.isLoginClicked = new ReactiveVar(true);
});

Template.front.helpers({
    listArticles: function () {
        return Articles.find(
            {},
            {
                sort: {
                    createdAt: -1
                }
            }
        );
    },
    listComments: function () {
        return Comments.find(
            {},
            {
                sort: {
                    createdAt: -1
                }
            }
        );
    },
    more: function () {
        return Template.instance().articlesLimit.get() <= Articles.find({}).count();
    },
    more2: function () {
        return Template.instance().commentsLimit.get() <= Comments.find({}).count();
    },
    isLoginClicked: function () {
        return Template.instance().isLoginClicked.get();
    },
    publicToString: function (isPublic) {
        return isPublic ? "공개" : "비공개";
    },
    timeAgo: function (time) {
        moment.locale('ko');
        return Template.instance().localtime.get() && moment(time).fromNow();
    },
    limitCommentLength: function (comment) {
        return comment.substring(0, 100);
    }
});

Template.front.onRendered(function () {
    $('.parallax-window').parallax({imageSrc: 'http://res.cloudinary.com/remotecontrol/image/upload/v1450084031/business_jzlpvg.jpg'});

    var self = this;
    self.autorun(function () {
        self.subscribe("ListArticles", self.articlesLimit.get(), function() {
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });

    self.autorun(function () {
        self.subscribe("FrontListComments", self.commentsLimit.get(), function() {
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });

});

Template.front.events({
    "click #more" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit + t.articlesLimit.get();

        t.articlesLimit.set(newLimit);
    },
    "click #more2" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit2 + t.commentsLimit.get();

        t.commentsLimit.set(newLimit);
    },
    "click #change-to-login" : function (e, t) {
        e.preventDefault();

        t.isLoginClicked.set(true);
    },
    "click #change-to-register" : function (e, t) {
        e.preventDefault();

        t.isLoginClicked.set(false);
    },
    "click #front-login-submit": function (e, t) {
        e.preventDefault();

        if (t.find("#front-login-username").value === "" ||
            t.find("#front-login-password").value === "") {
            sAlert.error("아이디/비밀번호 입력 후, 다시 시도해 주세요.",
                {
                    effect: '',
                    timeout: 2000,
                    onRouteClose: false,
                    stack: false
                });
            return;
        }

        Meteor.loginWithPassword(t.find("#front-login-username").value, t.find("#front-login-password").value, function (err) {
            if (!err) {
                sAlert.success("로그인에 성공하였습니다.",
                    {
                        effect: '',
                        timeout: 2000,
                        onRouteClose: false,
                        stack: false
                    });
            } else {
                sAlert.error("로그인에 실패하였습니다.",
                    {
                        effect: '',
                        timeout: 2000,
                        onRouteClose: false,
                        stack: false
                    });
            }
        });
    },
    "click #front-register-submit": function (e, t) {
        e.preventDefault();

        if (t.find("#front-register-username").value === "" ||
            t.find("#front-register-password").value === "") {
            sAlert.error("아이디/비밀번호 입력 후, 다시 시도해 주세요.",
                {
                    effect: '',
                    timeout: 2000,
                    onRouteClose: false,
                    stack: false
                });
            return;
        }

        Meteor.call("register", t.find("#front-register-username").value, t.find("#front-register-password").value, function (err, res) {
            if (!err) {
                if (res) {
                    sAlert.success("회원가입에 성공하였습니다. '" + res + "'로 로그인해주세요.",
                        {
                            effect: '',
                            timeout: 2000,
                            onRouteClose: false,
                            stack: false
                        });
                    t.find("#front-register-username").value = "";
                    t.find("#front-register-password").value = "";
                    t.isLoginClicked.set(true);
                } else {
                    sAlert.error("해당 '사용자 이름'이 이미 존재합니다. 회원가입에 실패하였습니다.",
                        {
                            effect: '',
                            timeout: 2000,
                            onRouteClose: false,
                            stack: false
                        });
                }
            } else {
                sAlert.error("해당 '사용자 이름'이 이미 존재합니다. 회원가입에 실패하였습니다.",
                    {
                        effect: '',
                        timeout: 2000,
                        onRouteClose: false,
                        stack: false
                    });
            }
        });
    },
    "click #front-logout": function (e, t) {
        e.preventDefault();

        Meteor.logout();
    }
});

Template.front.onDestroyed(function () {
    $(".parallax-mirror").remove();
    Meteor.clearInterval(this.interval);
});