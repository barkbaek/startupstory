Template.view.onCreated(function () {
    var self = this;
    self.currentArticle = new ReactiveVar(false);

    /***** moment.js 메서드를 1초마다 호출하기 위해 setInterval 선언 *****/
    this.localtime = new ReactiveVar(0);
    this.interval = Meteor.setInterval(function () {
        self.localtime.set(Random.id());
    }, 1000);

    /***** 서버에서 20개씩 끊어서 데이터 가져오기 위해 *****/
    self.limit = 20;
    self.commentsLimit = new ReactiveVar(this.limit);

    /***** 스크롤 위치 저장 *****/
    self.previousScrollTop = new ReactiveVar(0);


    self.curSympathyStars = new ReactiveVar(5);
    self.curRecommendStars = new ReactiveVar(5);
});

Template.view.helpers({
    currentArticle: function() {
        return Template.instance().currentArticle.get();
    },
    /***** moment.js 사용하여 '일분 전', '한시간 전'과 같이 출력하기 - 1초마다 호출됨 *****/
    timeAgo: function (time) {
        moment.locale('ko');
        return Template.instance().localtime.get() && moment(time).fromNow();
    },
    one: function () {
        return 1.5;
    },
    otherUsers: function () {
        var curUser = Meteor.user();
        var curArticle = Template.instance().currentArticle.get();
        if (!curUser) {
            return false;
        } else {
            if (curArticle) {
                return curUser._id === curArticle.writer ? false : true;
            } else {
                return false;
            }
        }
    },
    listComments: function () {
        return Comments.find(
            {
                articleId: Template.instance().data
            },
            {
                sort: {
                    createdAt: -1
                }
            }
        );
    },
    more: function () {
        return Template.instance().commentsLimit.get() <= Comments.find({}).count();
    },
    avgSympathyInteger: function (sympathy, commenters) {
        var val = Math.round(sympathy / commenters);

        switch (val) {
            case 5:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span>");
            case 4:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9734;</span>");
            case 3:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9734;</span> <span>&#9734;</span>");
            case 2:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9733;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span>");
            case 1:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span>");
            default:
                return new Spacebars.SafeString(
                    "<span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span>");
        }

    },
    avgRecommendInteger: function (recommend, commenters) {
        var val = Math.round(recommend / commenters);

        switch (val) {
            case 5:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span>");
            case 4:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9734;</span>");
            case 3:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9733;</span> <span>&#9733;</span> <span>&#9734;</span> <span>&#9734;</span>");
            case 2:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9733;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span>");
            case 1:
                return new Spacebars.SafeString(
                    "<span>&#9733;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span>");
            default:
                return new Spacebars.SafeString(
                    "<span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span> <span>&#9734;</span>");
        }
    },
    avgSympathyFloat: function (sympathy, commenters) {
        var result = sympathy / commenters;
        console.log(result);
        console.log(typeof result);
        return isNaN(result) ? "" : result.toFixed(2);

    },
    avgRecommendFloat: function (recommend, commenters) {
        var result = recommend / commenters;
        return isNaN(result) ? "" : result.toFixed(2);
    },
    sympathyStars: function () {
        var curSympathyStars = Template.instance().curSympathyStars.get();

        switch (curSympathyStars) {
            case 5:
                return new Spacebars.SafeString(
                    "<span id='sympathy-one'>&#9733;</span> <span id='sympathy-two'>&#9733;</span> <span id='sympathy-three'>&#9733;</span> <span id='sympathy-four'>&#9733;</span> <span id='sympathy-five'>&#9733;</span>");
            case 4:
                return new Spacebars.SafeString(
                    "<span id='sympathy-one'>&#9733;</span> <span id='sympathy-two'>&#9733;</span> <span id='sympathy-three'>&#9733;</span> <span id='sympathy-four'>&#9733;</span> <span id='sympathy-five'>&#9734;</span>");
            case 3:
                return new Spacebars.SafeString(
                    "<span id='sympathy-one'>&#9733;</span> <span id='sympathy-two'>&#9733;</span> <span id='sympathy-three'>&#9733;</span> <span id='sympathy-four'>&#9734;</span> <span id='sympathy-five'>&#9734;</span>");
            case 2:
                return new Spacebars.SafeString(
                    "<span id='sympathy-one'>&#9733;</span> <span id='sympathy-two'>&#9733;</span> <span id='sympathy-three'>&#9734;</span> <span id='sympathy-four'>&#9734;</span> <span id='sympathy-five'>&#9734;</span>");
            case 1:
                return new Spacebars.SafeString(
                    "<span id='sympathy-one'>&#9733;</span> <span id='sympathy-two'>&#9734;</span> <span id='sympathy-three'>&#9734;</span> <span id='sympathy-four'>&#9734;</span> <span id='sympathy-five'>&#9734;</span>");
            default:
                return new Spacebars.SafeString(
                    "<span id='sympathy-one'>&#9733;</span> <span id='sympathy-two'>&#9733;</span> <span id='sympathy-three'>&#9733;</span> <span id='sympathy-four'>&#9733;</span> <span id='sympathy-five'>&#9733;</span>");
        }
    },
    recommendStars: function () {
        var curRecommendStars = Template.instance().curRecommendStars.get();

        switch (curRecommendStars) {
            case 5:
                return new Spacebars.SafeString(
                    "<span id='recommend-one'>&#9733;</span> <span id='recommend-two'>&#9733;</span> <span id='recommend-three'>&#9733;</span> <span id='recommend-four'>&#9733;</span> <span id='recommend-five'>&#9733;</span>");
            case 4:
                return new Spacebars.SafeString(
                    "<span id='recommend-one'>&#9733;</span> <span id='recommend-two'>&#9733;</span> <span id='recommend-three'>&#9733;</span> <span id='recommend-four'>&#9733;</span> <span id='recommend-five'>&#9734;</span>");
            case 3:
                return new Spacebars.SafeString(
                    "<span id='recommend-one'>&#9733;</span> <span id='recommend-two'>&#9733;</span> <span id='recommend-three'>&#9733;</span> <span id='recommend-four'>&#9734;</span> <span id='recommend-five'>&#9734;</span>");
            case 2:
                return new Spacebars.SafeString(
                    "<span id='recommend-one'>&#9733;</span> <span id='recommend-two'>&#9733;</span> <span id='recommend-three'>&#9734;</span> <span id='recommend-four'>&#9734;</span> <span id='recommend-five'>&#9734;</span>");
            case 1:
                return new Spacebars.SafeString(
                    "<span id='recommend-one'>&#9733;</span> <span id='recommend-two'>&#9734;</span> <span id='recommend-three'>&#9734;</span> <span id='recommend-four'>&#9734;</span> <span id='recommend-five'>&#9734;</span>");
            default:
                return new Spacebars.SafeString(
                    "<span id='recommend-one'>&#9733;</span> <span id='recommend-two'>&#9733;</span> <span id='recommend-three'>&#9733;</span> <span id='recommend-four'>&#9733;</span> <span id='recommend-five'>&#9733;</span>");
        }
    }
});

Template.view.onRendered(function () {
    var self = this;

    Meteor.call("viewArticle", this.data, function (err, res) {
        if (!err) {
            self.currentArticle.set(res);
        }
    });

    self.autorun(function () {
        self.subscribe("ListComments", self.data, self.commentsLimit.get(), function() {
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });

    Meteor.call("incCntOfArticle", this.data, function (err, res) {});

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '',    // Use yours
            cookie     : true,  // enable cookies to allow the server to access
                                // the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.2' // use version 2.2
        });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
});

Template.view.events({
    "click #more" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit + t.commentsLimit.get();

        t.commentsLimit.set(newLimit);
    },
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    },
    "click #facebook-share" : function(e, t) {
        e.preventDefault();

        var currentArticle = Template.instance().currentArticle.get();

        var photo = "http://res.cloudinary.com/remotecontrol/image/upload/v1450084031/business_jzlpvg.jpg";

        FB.ui({
            method: 'feed',
            link: "http://c-val.meteor.com" + FlowRouter.current().path,
            caption: "c-val.meteor.com",
            description: currentArticle.content.substring(0, 100) + "",
            name: currentArticle.title.substring(0, 20) + "",
            picture: photo
        }, function(response){
            if (response) {
                /* 공유하였음! */
                var post_id = response.post_id;
                var userId = FB.getUserID();

            }
        });
    },
    "click #comment-submit" : function (e, t) {
        e.preventDefault();

        var ratingSympathy = t.curSympathyStars.get();
        var ratingRecommend = t.curRecommendStars.get();

        var createComment = t.find("#create-comment").value;

        if (createComment.length === 0 ) {

            sAlert.error("내용 입력 후 다시 시도해주세요.",
                {
                    effect: '',
                    timeout: 2000,
                    onRouteClose: false,
                    stack: false
                });
            return;
        }

        console.log("ratingSympathy : " + ratingSympathy);
        console.log("ratingRecommend : " + ratingRecommend);
        console.log("createComment : " + createComment);

        Meteor.call("addComments", t.data, ratingSympathy, ratingRecommend, createComment,
            function (err, res) {
                if (!err) {
                    if (res) {
                        sAlert.success("축하드립니다. 작성자에게 힘을 보태주셨습니다!",
                            {
                                effect: '',
                                timeout: 2000,
                                onRouteClose: false,
                                stack: false
                            });
                        t.find("#create-comment").value = "";

                    } else {
                        sAlert.error("이전에 이미 힘을 보태주셨습니다. 다시 힘을 보태주시려는 노력 감사합니다.",
                            {
                                effect: '',
                                timeout: 2000,
                                onRouteClose: false,
                                stack: false
                            });
                    }
                } else {
                    sAlert.error("등록에 실패하였습니다. 관리자에게 문의 바랍니다.",
                        {
                            effect: '',
                            timeout: 2000,
                            onRouteClose: false,
                            stack: false
                        });
                }
            }
        );
    },
    "click #sympathy-one": function (e, t) {
        e.preventDefault();
        t.curSympathyStars.set(1);
    },
    "click #sympathy-two": function (e, t) {
        e.preventDefault();
        t.curSympathyStars.set(2);
    },
    "click #sympathy-three": function (e, t) {
        e.preventDefault();
        t.curSympathyStars.set(3);
    },
    "click #sympathy-four": function (e, t) {
        e.preventDefault();
        t.curSympathyStars.set(4);
    },
    "click #sympathy-five": function (e, t) {
        e.preventDefault();
        t.curSympathyStars.set(5);
    },


    "click #recommend-one": function (e, t) {
        e.preventDefault();
        t.curRecommendStars.set(1);
    },
    "click #recommend-two": function (e, t) {
        e.preventDefault();
        t.curRecommendStars.set(2);
    },
    "click #recommend-three": function (e, t) {
        e.preventDefault();
        t.curRecommendStars.set(3);
    },
    "click #recommend-four": function (e, t) {
        e.preventDefault();
        t.curRecommendStars.set(4);
    },
    "click #recommend-five": function (e, t) {
        e.preventDefault();
        t.curRecommendStars.set(5);
    }
});

Template.view.onDestroyed(function () {
    Meteor.clearInterval(this.interval);
});