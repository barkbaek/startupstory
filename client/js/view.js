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

    /***** 댓글 입력 시, 사용자가 지정한 별점을 임시 저장 *****/
    /***** curSympathyStars : 완전 내 심정, curRecommendStars : 이건 꼭 추천 *****/
    self.curSympathyStars = new ReactiveVar(5);
    self.curRecommendStars = new ReactiveVar(5);
});

Template.view.helpers({
    /***** 현재 게시물 반환 *****/
    currentArticle: function() {
        return Template.instance().currentArticle.get();
    },
    /***** moment.js 사용하여 '일분 전', '한시간 전'과 같이 출력하기 - 1초마다 호출됨 *****/
    timeAgo: function (time) {
        moment.locale('ko');
        return Template.instance().localtime.get() && moment(time).fromNow();
    },
    /***** 현재 게시물을 보고 있는 사용자가 작성자가 아닐 경우 true 반환 *****/
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
    /***** 댓글 목록을 최신순으로 반환 *****/
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
    /***** 댓글이 더 존재할 경우 'more' 바 보이기 *****/
    more: function () {
        return Template.instance().commentsLimit.get() <= Comments.find({}).count();
    },
    /***** 현재 게시물에 대한 평균 공감도(완전 내 심정)를 정수로 계산하여 별점으로 변환 후 반환 *****/
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
    /***** 현재 게시물에 대한 평균 추천도(이건 꼭 추천)를 정수로 계산하여 별점으로 변환 후 반환 *****/
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
    /***** 현재 게시물에 대한 평균 공감도(완전 내 심정)를 소수점 두 자리 실수로 계산 후 반환 *****/
    avgSympathyFloat: function (sympathy, commenters) {
        var result = sympathy / commenters;
        console.log(result);
        console.log(typeof result);
        return isNaN(result) ? "" : result.toFixed(2);

    },
    /***** 현재 게시물에 대한 평균 추천도(이건 꼭 추천)를 소수점 두 자리 실수로 계산 후 반환 *****/
    avgRecommendFloat: function (recommend, commenters) {
        var result = recommend / commenters;
        return isNaN(result) ? "" : result.toFixed(2);
    },
    /***** 현재 댓글다는 사용자가 선택한 공감도(완전 내 심정)를 별점으로 변환 후 반환 *****/
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
    /***** 현재 댓글다는 사용자가 선택한 추천도(이건 꼭 추천)를 별점으로 변환 후 반환 *****/
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

    /***** 서버에게 현재 게시물 정보 요청 후 가져오기 *****/
    Meteor.call("viewArticle", this.data, function (err, res) {
        if (!err) {
            self.currentArticle.set(res);
        }
    });

    self.autorun(function () {
        /***** 댓글 목록 가져오기 *****/
        self.subscribe("ListComments", self.data, self.commentsLimit.get(), function() {
            /***** 템플릿(html 파일들) Flush된 후, 데이터 전송받기 전 스크롤 위치로 이동(즉, 데이터 전송받기 전 스크롤 위치 유지하기 위해 사용) *****/
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });

    /***** 현재 게시물 조회 수 1 증가 *****/
    Meteor.call("incCntOfArticle", this.data, function (err, res) {});

    /***** 페이스북 공유하기 위해 사용 *****/
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
    /***** more 바 클릭 시, 현재 스크롤 위치 저장 및 댓글 최대 20개 더 가져오기 *****/
    "click #more" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit + t.commentsLimit.get();

        t.commentsLimit.set(newLimit);
    },
    /***** 페이지 우측 상단에 로그아웃 클릭 시, 계정 로그아웃. *****/
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    },
    /***** '페이스북에 공유하기' 클릭 시, 현재 게시물 정보 공유하기 *****/
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
    /***** '힘 보태주기' - '등록하기' 클릭 시, 서버에 해당 정보(현재 게시물 아이디, 공감도, 추천도, 댓글 내용) 전송 *****/
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

    /***** '힘 보태주기'의 '완전 내 심정' 별점 클릭 시, 숫자로 변환하여 저장 *****/
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

    /***** '힘 보태주기'의 '이건 꼭 추천' 별점 클릭 시, 숫자로 변환하여 저장 *****/
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
    /***** clearInterval *****/
    Meteor.clearInterval(this.interval);
});
