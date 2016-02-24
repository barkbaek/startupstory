Template.create.onCreated(function () {
    var self = this;
    self.isPublic = new ReactiveVar(false);

});

Template.create.helpers({
    isPublic: function () {
        return Template.instance().isPublic.get();
    }
});

Template.create.onRendered(function () {

});

Template.create.events({
    "click #right-logout" : function (e, t) {
        e.preventDefault();

        Meteor.logout();
    },
    "click #closed" : function (e, t) {
        e.preventDefault();

        t.isPublic.set(false);
    },
    "click #opened" : function (e, t) {
        e.preventDefault();

        t.isPublic.set(true);
    },
    "click #create-submit" : function (e, t) {
        e.preventDefault();

        var year = t.find("#create-year").value;
        var type = t.find("#create-type").value;
        var companyName = t.find("#create-company-name").value;
        var name = t.find("#create-name").value;
        var title = t.find("#create-title").value;
        var content = t.find("#create-content").value;

        var curUser = Meteor.user();

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