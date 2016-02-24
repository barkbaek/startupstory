FlowRouter.route('/', {
    name: "front",
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {content: 'front'});
    }
});

FlowRouter.route('/admin', {
    name: "admin",
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {content: 'admin'});
    }
});

FlowRouter.route('/create', {
    name: "create",
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {content: 'create'});
    }
});

FlowRouter.route('/login', {
    name: "login",
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {content: 'login'});
    }
});

FlowRouter.route('/register', {
    name: "register",
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {content: 'register'});
    }
});

FlowRouter.route('/view/:id', {
    name: "view",
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {content: 'view', data: params.id});
    }
});

FlowRouter.route('/test', {
    name: "test",
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {content: 'test'});
    }
});

FlowRouter.route('/about', {
    name: "about",
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {content: 'about'});
    }
});

FlowRouter.route('/contact', {
    name: "contact",
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {content: 'contact'});
    }
});