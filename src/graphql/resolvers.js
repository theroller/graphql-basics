// demo data
const comments = [
    { id: 1, author: 2, post: 4, text: 'it was a dark and stormy night' },
    { id: 2, author: 2, post: 4, text: 'frig yas all' },
    { id: 3, author: 3, post: 2, text: 'too much to do' },
    { id: 4, author: 1, post: 1, text: 'the sky was falling that night' },
];
const posts = [
    { id: 1, author: 1, published: true, title: 'doo wop', body: 'this is a body' },
    { id: 2, author: 3, published: false, title: 'foo bar', body: 'try me' },
    { id: 3, author: 3, published: true, title: 'kitty c', body: 'walk this way' },
    { id: 4, author: 2, published: true, title: 'shrug', body: 'tbd' },
];
const users = [
    { id: 1, name: 'james', email: 'james@gmail.com' },
    { id: 2, name: 'frank', email: 'frank@gmail.com' },
    { id: 3, name: 'jillian', email: 'jillian@gmail.com' },
];

const Query = {
    comments() {
        return comments;
    },
    me() {
        return users[0];
    },
    post() {
        return posts[0];
    },
    posts(parent, args) {
        if (args.query) {
            const re = new RegExp(args.query.toLowerCase());
            return posts.filter(x => re.test(x.title.toLowerCase()) || re.test(x.body.toLowerCase()));
        }
        return posts;
    },
    users(parent, args) {
        if (args.query) {
            const re = new RegExp(args.query.toLowerCase());
            return users.filter(x => re.test(x.name.toLowerCase()));
        }
        return users;
    },
};

const Comment = {
    author(parent) {
        return users.find(x => x.id === parent.author);
    },
    post(parent) {
        return posts.find(x => x.id === parent.post);
    },
};

const Post = {
    author(parent) {
        return users.find(x => x.id === parent.author);
    },
    comments(parent) {
        return comments.filter(x => x.post === parent.id);
    },
};

const User = {
    comments(parent) {
        return comments.filter(x => x.author === parent.id);
    },
    posts(parent) {
        return posts.filter(x => x.author === parent.id);
    },
};

const resolvers = { Comment, Post, Query, User };
export { resolvers as default };
