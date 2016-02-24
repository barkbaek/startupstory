Template.front.onCreated(function () {
    console.log("front onCreated");

    var self = this;

    /***** moment.js 메서드를 1초마다 호출하기 위해 setInterval 선언 *****/
    self.localtime = new ReactiveVar(0);
    self.interval = Meteor.setInterval(function () {
        self.localtime.set(Random.id());
    }, 1000);

    /***** 게시물용 - 서버에서 20개씩 끊어서 데이터 가져오기 위해 *****/
    self.limit = 20;
    self.articlesLimit = new ReactiveVar(this.limit);

    /***** 힘 보태주기용 - 서버에서 20개씩 끊어서 데이터 가져오기 위해 *****/
    self.limit2 = 20;
    self.commentsLimit = new ReactiveVar(this.limit2);

    /***** 스크롤 위치 저장 *****/
    self.previousScrollTop = new ReactiveVar(0);

    /***** true : 로그인 창 보이기, false : 회원가입 창 보이기 *****/
    self.isLoginClicked = new ReactiveVar(true);
});

Template.front.helpers({
    /***** 게시물 목록 최신 순으로 반환 *****/
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
    /***** 댓글 목록 최신 순으로 반환 *****/
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
    /***** 게시물이 더 존재할 경우, 'more' 바 보이기 *****/
    more: function () {
        return Template.instance().articlesLimit.get() <= Articles.find({}).count();
    },
    /***** 댓글이 더 존재할 경우, 'more' 바 보이기 *****/
    more2: function () {
        return Template.instance().commentsLimit.get() <= Comments.find({}).count();
    },
    /***** true : 로그인 창 보이기, false : 회원가입 창 보이기 *****/
    isLoginClicked: function () {
        return Template.instance().isLoginClicked.get();
    },
    /***** moment.js 사용하여 '일분 전', '한시간 전'과 같이 출력하기 - 1초마다 호출됨 *****/
    timeAgo: function (time) {
        moment.locale('ko');
        return Template.instance().localtime.get() && moment(time).fromNow();
    },
    /***** 댓글 길이 최대 100 까지만 보이게 잘라서 반환 *****/
    limitCommentLength: function (comment) {
        return comment.substring(0, 100);
    }
});

Template.front.onRendered(function () {
    /***** 스크롤해도 사진 고정되게 하기 위해 jQuery parallax 사용 *****/
    $('.parallax-window').parallax({imageSrc: 'http://res.cloudinary.com/remotecontrol/image/upload/v1450084031/business_jzlpvg.jpg'});

    var self = this;
    self.autorun(function () {
        /***** 게시물 목록 가져오기 *****/
        self.subscribe("ListArticles", self.articlesLimit.get(), function() {
            /***** 템플릿(html 파일들) Flush된 후, 데이터 전송받기 전 스크롤 위치로 이동(즉, 데이터 전송받기 전 스크롤 위치 유지하기 위해 사용) *****/
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });

    self.autorun(function () {
        /***** 댓글 목록 가져오기 *****/
        self.subscribe("FrontListComments", self.commentsLimit.get(), function() {
            /***** 템플릿(html 파일들) Flush된 후, 데이터 전송받기 전 스크롤 위치로 이동(즉, 데이터 전송받기 전 스크롤 위치 유지하기 위해 사용) *****/
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });

});

Template.front.events({
    /***** more 바 클릭 시, 현재 스크롤 위치 저장 및 게시물 최대 20개 더 가져오기 *****/
    "click #more" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit + t.articlesLimit.get();

        t.articlesLimit.set(newLimit);
    },
    /***** more 바 클릭 시, 현재 스크롤 위치 저장 및 댓글 최대 20개 더 가져오기 *****/
    "click #more2" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit2 + t.commentsLimit.get();

        t.commentsLimit.set(newLimit);
    },
    /***** 회원가입 창에서 로그인 창으로 전환 *****/
    "click #change-to-login" : function (e, t) {
        e.preventDefault();

        t.isLoginClicked.set(true);
    },
    /***** 로그인 창에서 회원가입 창으로 전환 *****/
    "click #change-to-register" : function (e, t) {
        e.preventDefault();

        t.isLoginClicked.set(false);
    },
    /***** 로그인 클릭 시 *****/
    "click #front-login-submit": function (e, t) {
        e.preventDefault();

        /***** 아이디 혹은 비밀번호 미입력시 경고 창 띄우고 이벤트 메서드 종료 *****/
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

        /***** 로그인 시도하기 *****/
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
    /***** 회원가입 클릭 시 *****/
    "click #front-register-submit": function (e, t) {
        e.preventDefault();

        /***** 아이디 혹은 비밀번호 미입력시 경고 창 띄우고 이벤트 메서드 종료 *****/
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

        /***** 회원가입 시도하기 *****/
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
    /***** 로그아웃 클릭 시, 계정 로그아웃. *****/
    "click #front-logout": function (e, t) {
        e.preventDefault();

        Meteor.logout();
    }
});

Template.front.onDestroyed(function () {
    /***** parallax 제거 및 clearInterval *****/
    $(".parallax-mirror").remove();
    Meteor.clearInterval(this.interval);
});
