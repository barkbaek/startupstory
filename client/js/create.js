Template.create.onCreated(function () {
    var self = this;

    /***** 사용자 정보 공개 여부 저장 *****/
    self.isPublic = new ReactiveVar(false);
});

Template.create.helpers({
    /***** 사용자 정보 공개 여부 반환 *****/
    isPublic: function () {
        return Template.instance().isPublic.get();
    }
});

Template.create.onRendered(function () {

});

Template.create.events({
    /***** 페이지 우측 상단에 로그아웃 클릭 시, 계정 로그아웃. *****/
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    },
    /***** 사용자 정보 비공개 설정 - 회사 이름, 실명 비공개 *****/
    "click #closed" : function (e, t) {
        e.preventDefault();

        t.isPublic.set(false);
    },
    /***** 사용자 정보 공개 설정 *****/
    "click #opened" : function (e, t) {
        e.preventDefault();

        t.isPublic.set(true);
    },
    /***** 게시물 업로드 *****/
    "click #create-submit" : function (e, t) {
        e.preventDefault();

        /***** year : 창업 연도/연차, type : 업종, companyName : 회사 이름, name : 실명, title : 제목, content : 내용 *****/
        var year = t.find("#create-year").value;
        var type = t.find("#create-type").value;
        var companyName = t.find("#create-company-name").value;
        var name = t.find("#create-name").value;
        var title = t.find("#create-title").value;
        var content = t.find("#create-content").value;

        /***** 로그인한 사용자 저장 *****/
        var curUser = Meteor.user();

        /***** 로그인하지 않은 경우, 경고 창 띄우기 *****/
        if (!curUser) {
            sAlert.error("로그인 후 다시 시도해주세요. (주의 : 로그인 하기 전, 현재 입력한 정보를 다른 곳에 임시로 보관해 주세요.)",
                {
                    effect: '',
                    timeout: 5000,
                    onRouteClose: false,
                    stack: false
                });
            return;
        }

        /***** 만약, 필수 정보 입력하지 않은 경우, 경고 창 띄우기 *****/
        if (
            year.length === 0 ||
            type.length === 0 ||
            companyName.length === 0 ||
            name.length === 0 ||
            title.length === 0 ||
            content.length === 0
        ) {
            sAlert.error("필수 정보 입력 후 다시 시도해주세요.",
                {
                    effect: '',
                    timeout: 2000,
                    onRouteClose: false,
                    stack: false
                });
            return ;
        }

        /***** 서버에 정보 전송 -> 데이터베이스에 저장된 경우 성공하였다는 문구 띄우거나, 실패한 경우 실패하였다는 경고 창 띄우기. *****/
        Meteor.call("createArticle", t.isPublic.get(), year, type, companyName, name, title, content, function (err, res) {
            if (!err) {
                if (res) {
                    sAlert.success("성공적으로 게시물을 등록하였습니다.",
                        {
                            effect: '',
                            timeout: 2000,
                            onRouteClose: false,
                            stack: false
                        });
                    t.find("#create-year").value = "";
                    t.find("#create-type").value  = "";
                    t.find("#create-company-name").value = "";
                    t.find("#create-name").value = "";
                    t.find("#create-title").value = "";
                    t.find("#create-content").value = "";
                    FlowRouter.go("/");
                } else {
                    sAlert.error("오류로 인해 게시물 작성에 실패하였습니다. 관리자에게 문의 바랍니다.",
                        {
                            effect: '',
                            timeout: 2000,
                            onRouteClose: false,
                            stack: false
                        });
                }
            } else {
                sAlert.error("오류로 인해 게시물 작성에 실패하였습니다. 관리자에게 문의 바랍니다.",
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

Template.create.onDestroyed(function () {

});
