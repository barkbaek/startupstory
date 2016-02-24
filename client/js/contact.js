Template.contact.onCreated(function () {
    var self = this;

    /***** moment.js 메서드를 1초마다 호출하기 위해 setInterval 선언 *****/
    self.localtime = new ReactiveVar(0);
    self.interval = Meteor.setInterval(function () {
        self.localtime.set(Random.id());
    }, 1000);

    /***** 서버에서 20개씩 끊어서 데이터 가져오기 위해 *****/
    self.limit = 20;
    self.inquiriesLimit = new ReactiveVar(this.limit);

    /***** 스크롤 위치 저장 *****/
    self.previousScrollTop = new ReactiveVar(0);
});

Template.contact.helpers({
    /***** moment.js 사용하여 '일분 전', '한시간 전'과 같이 출력하기 - 1초마다 호출됨 *****/
    timeAgo: function (time) {
        moment.locale('ko');
        return Template.instance().localtime.get() && moment(time).fromNow();
    },
    /***** 현재 로그인 사용자와 관리자간 대화 내용 가져오기 *****/
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
    /***** 현재 로그인 사용자와 관리자간 메시지가 더 존재할 경우 'more' 바 보이기 *****/
    more: function () {
        return Template.instance().inquiriesLimit.get() <= Inquiry.find({}).count();
    }
});

Template.contact.onRendered(function () {
    var self = this;

    self.autorun(function () {
        /***** 로그인한 사용자라면 해당 사용자와 관리자간 대화 내용 가져오기 *****/
        self.subscribe("ListInquiries", self.inquiriesLimit.get(), function() {
            /***** 템플릿(html 파일들) Flush된 후, 데이터 전송받기 전 스크롤 위치로 이동(즉, 데이터 전송받기 전 스크롤 위치 유지하기 위해 사용) *****/
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });
});

Template.contact.events({
    /***** more 바 클릭 시, 현재 스크롤 위치 저장 및 데이터 최대 20개 더 가져오기 *****/
    "click #contact-more" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit + t.inquiriesLimit.get();

        t.inquiriesLimit.set(newLimit);
    },
    /***** 페이지 우측 상단에 로그아웃 클릭 시, 계정 로그아웃. *****/
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    },
    /***** 로그인한 사용자라면 관리자에게 메시지 전달 *****/
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
    /***** clearInterval *****/
    Meteor.clearInterval(this.interval);
});
