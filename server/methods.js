Meteor.startup(function () {
    Meteor.methods({
        register: function (username, password) {
            try {
                check(username, String);
                check(password, String);
            } catch (err) {
                return false;
            }

            if (username.length === 0 || password.length === 0) return false;

            var userId = Accounts.createUser({
                username: username,
                password: password
            });

            Inquiry.insert({
                from: false,
                userId: userId,
                username: username,
                checked: true,
                msg: "'끈기의계곡'을 이용해 주셔서 감사합니다.\n 무엇을 도와드릴까요 ?",
                createdAt: new Date()
            });

            return username;
        },
        createArticle: function (isPublic, year, type, companyName, name, title, content) {

            if (!this.userId) return false;

            try {
                check(isPublic, Boolean);
                check(year, String);
                check(type, String);
                check(companyName, String);
                check(name, String);
                check(title, String);
                check(content, String);
            } catch (err) {
                return false;
            }

            Articles.insert({
                writer: this.userId,
                isPublic: isPublic,
                year: year,
                type: type,
                companyName: companyName,
                name: name,
                title: title,
                content: content,
                count: 0,
                totalSympathy: 0,
                totalRecommend: 0,
                totalCommenters: 0,
                createdAt: new Date
            });

            return true;
        },
        viewArticle: function(id) {
            var article = Articles.findOne({_id: id});

            var isPublic = article.isPublic;

            return isPublic? {
                writer: article.writer,
                year: article.year,
                type: article.type,
                companyName: article.companyName,
                name: article.name,
                title: article.title,
                content: article.content,
                count: article.count,
                totalSympathy: article.totalSympathy,
                totalRecommend: article.totalRecommend,
                totalCommenters: article.totalCommenters,
                createdAt: article.createdAt
            } : {
                writer: article.writer,
                year: article.year,
                type: article.type,
                title: article.title,
                content: article.content,
                count: article.count,
                totalSympathy: article.totalSympathy,
                totalRecommend: article.totalRecommend,
                totalCommenters: article.totalCommenters,
                createdAt: article.createdAt
            };
        },
        incCntOfArticle: function (id) {
            Articles.update(
                {
                    _id: id
                },
                {
                    $inc: {
                        count: 1
                    }
                }
            );
        },
        addComments: function (articleId, sympathy, recommend, comment) {

            /* this.userId가 존재하지 않는 사용자일 경우, return false */
            var userId = this.userId;
            if (!userId) {
                return false;
            }

            var prevComment = Comments.findOne({
                articleId: articleId,
                userId: userId
            });

            if (prevComment) {
                return false;
            }

            /* Comments 컬렉션에 추가하기. */

            Comments.insert({
                articleId: articleId,
                userId: userId,
                username: Meteor.user().username,
                sympathy: sympathy,
                recommend: recommend,
                comment: comment,
                createdAt: new Date
            });

            console.log("articleId : " + articleId +
                "\nsympathy : " + sympathy +
            "\nrecommend : " + recommend +
                "\ncomment : " + comment);

            console.log("\nthis.userId : " + this.userId);
            console.log("\nusername : " + Meteor.user().username);


            /* article에 sympathy, recommend, 댓글단 사용자 수 추가하기 */
            Articles.update(
                {
                    _id: articleId
                },
                {
                    $inc: {
                        totalSympathy: sympathy,
                        totalRecommend: recommend,
                        totalCommenters: 1
                    }
                }
            );

            return true;
        },

        inquiryToAdmin: function (msg) {
            var userId = this.userId;
            if (!userId) return false;

            Inquiry.insert({
                from: true,
                userId: userId,
                username: Meteor.user().username,
                checked: false,
                msg: msg,
                createdAt: new Date()
            });

            return true;
        },
        checkToTrue: function (password, id) {
            if (password !== "1234") return false;

            Inquiry.update(
                {
                    _id: id
                },
                {
                    $set: {
                        checked: true
                    }
                }
            );

            return true;
        },
        inquiryToUser: function (password, username, msg) {
            if (password !== "1234") return false;

            var doc = Meteor.users.findOne({username: username});
            var userId = doc._id;

            Inquiry.insert({
                from: false,
                userId: userId,
                username: username,
                checked: true,
                msg: msg,
                createdAt: new Date()
            });

            return true;

        },
        IamAdmin: function (password) {
            return password === "1234";
        }
    });
});