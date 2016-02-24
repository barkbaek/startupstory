Template.admin.onCreated(function () {
    var self = this;

    /***** 관리자가 맞는지 판단하기 위해 사용 *****/
    self.currentPassword = new ReactiveVar(0);
    self.iamadmin = new ReactiveVar(false);

    /***** 현재 선택된 사용자 저장 *****/
    self.selectedUser = new ReactiveVar("");

    /***** moment.js 메서드를 1초마다 호출하기 위해 setInterval 선언 *****/
    self.localtime = new ReactiveVar(0);
    self.interval = Meteor.setInterval(function () {
        self.localtime.set(Random.id());
    }, 1000);

    /***** 클라이언트가 관리자에게 요청하는 회수 100개 제한. 100개 초과 시, 마우스 클릭하면 그 다음 100개 추가로 가져옴. *****/
    self.limit = 100;
    self.inquiriesLimit = new ReactiveVar(this.limit);

    /***** 스크롤 위치 저장 *****/
    self.previousScrollTop = new ReactiveVar(0);
});

Template.admin.helpers({
    /***** moment.js 사용하여 '일분 전', '한시간 전'과 같이 출력하기 - 1초마다 호출됨 *****/
    timeAgo: function (time) {
        moment.locale('ko');
        return Template.instance().localtime.get() && moment(time).fromNow();
    },
    /***** 클라이언트의 대화 요청 목록 시간 순서대로 가져온 후, 템플릿으로 반환 *****/
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
    /***** 클라이언트 대화 요청이 더 존재할 경우, 'more' 바 보이기 *****/
    more: function () {
        return Template.instance().inquiriesLimit.get() <= Inquiry.find({}).count();
    },
    /***** 단일 클라이언트 대화 목록 반환 *****/
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
    /***** 검정 : 아직 확인하지 않은 클라이언트 요청, 빨강 : 확인한 클라이언트 요청 *****/
    changeColor: function (checked) {
        return checked ? "color: black;" : "color: red";
    },
    /***** 관리자 로그인 성공 여부 반환 *****/
    iamadmin: function () {
        return Template.instance().iamadmin.get();
    }
});

Template.admin.onRendered(function () {
    var self = this;

    self.autorun(function () {
        /***** 관리자로 로그인 시도한 비밀번호 서버 전송 후, 맞을 경우 전체 클라이언트 요청 목록 가져오기 *****/
        self.subscribe("AdminListInquiries", self.currentPassword.get(), self.inquiriesLimit.get(), function() {
            /***** 템플릿(html 파일들) Flush된 후, 데이터 전송받기 전 스크롤 위치로 이동(즉, 데이터 전송받기 전 스크롤 위치 유지하기 위해 사용) *****/
            Tracker.afterFlush(function () {
                $(window).scrollTop(
                    self.previousScrollTop.get()
                );
            });
        });
    });

    self.autorun(function () {
            /***** 관리자로 로그인 시도한 비밀번호 서버 전송 후, 맞을 경우 단일 클라이언트 대화 목록 가져오기 *****/
            self.subscribe("AdminSingleUserInquiries", self.currentPassword.get(), self.selectedUser.get(), function () {
        });
    });
});

Template.admin.events({
    /***** 관리자로 로그인 시도한 비밀번호를 currentPassword에 저장 후, 서버에 전송하여 확인 *****/
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
    /***** 페이지 우측 상단에 로그아웃 클릭 시, 계정 로그아웃. *****/
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    },
    /***** more 바 클릭 시, 현재 스크롤 위치 저장 및 데이터 최대 100개 더 가져오기 *****/
    "click #more" : function (e, t) {
        e.preventDefault();

        t.previousScrollTop.set($(window).scrollTop());

        var newLimit = t.limit + t.inquiriesLimit.get();

        t.inquiriesLimit.set(newLimit);
    },
    /***** 클라이언트 이름 클릭 시, selectedUser에 해당 클라이언트 이름 저장 *****/
    "click .usernames" : function (e, t) {
        e.preventDefault();

        t.selectedUser.set(this + "");
    },
    /***** 단일 클라이언트 요청 확인 후, 빨간 색에서 검은 색으로 '읽음' 표시할 때 사용. 즉, 해당 데이터(단일 대화 내용)를 '읽음'으로 표시.  *****/
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
    /***** 서버로 관리자 로그인 비밀번호, 클라이언트 이름, 메시지 전송 후, 이상이 없다면 클라이언트에게 메시지 전달. *****/
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
    /***** clearInterval *****/
    Meteor.clearInterval(this.interval);
});