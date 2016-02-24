Template.register.onCreated(function () {

});

Template.register.helpers({

});

Template.register.onRendered(function () {
});

Template.register.events({
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
                    FlowRouter.go("/");
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
    }
});

Template.register.onDestroyed(function () {

});