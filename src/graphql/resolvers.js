// demo data
const posts = [
    { id: 1, author: 1, published: true, title: 'doo wop', body: 'this is a body' },
    { id: 2, author: 1, published: false, title: 'foo bar', body: 'try me' },
    { id: 3, author: 3, published: true, title: 'kitty c', body: 'walk this way' },
];
const users = [
    { id: 1, name: 'james', email: 'james@gmail.com' },
    { id: 2, name: 'frank', email: 'frank@gmail.com' },
    { id: 3, name: 'jillian', email: 'jillian@gmail.com' },
];

const Query = {
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

const Post = {
    author(parent) {
        return users.find(x => x.id === parent.author);
    }
};

const resolvers = { Post, Query };
export { resolvers as default };
