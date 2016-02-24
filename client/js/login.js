Template.login.onCreated(function () {

});

Template.login.helpers({

});

Template.login.onRendered(function () {
});

Template.login.events({
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
                FlowRouter.go("/");
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
    }
});

Template.login.onDestroyed(function () {

});