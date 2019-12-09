import uuidv4 from 'uuid/v4';

// demo data
let comments = [
    { id: 1, author: 2, post: 4, text: 'it was a dark and stormy night' },
    { id: 2, author: 2, post: 4, text: 'frig yas all' },
    { id: 3, author: 3, post: 2, text: 'too much to do' },
    { id: 4, author: 1, post: 1, text: 'the sky was falling that night' },
];
let posts = [
    { id: 1, author: 1, published: true, title: 'doo wop', body: 'this is a body' },
    { id: 2, author: 3, published: false, title: 'foo bar', body: 'try me' },
    { id: 3, author: 3, published: true, title: 'kitty c', body: 'walk this way' },
    { id: 4, author: 2, published: true, title: 'shrug', body: 'tbd' },
];
let users = [
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

const Mutation = {
    createComment(parent, args) {
        const author = users.find(user => user.id == args.data.author);
        if (!author) {
            throw new Error('author not found');
        }
        const post = posts.find(post => post.id == args.data.post && post.published);
        if (!post) {
            throw new Error('published post not found');
        }

        const comment = { id: uuidv4(), ...args.data };
        comments.push(comment);

        return comment;
    },
    createPost(parent, args) {
        const author = users.find(user => user.id == args.data.author);
        if (!author) {
            throw new Error('author not found');
        }

        const post = { id: uuidv4(), ...args.data };
        posts.push(post);

        return post;
    },
    createUser(parent, args) {
        let user = users.find(user => user.email === args.data.email);
        if (user) {
            throw new Error('email taken');
        }

        user = { id: uuidv4(), ...args.data };
        users.push(user);

        return user;
    },
    deleteComment(parent, args) {
        const commentIndex = comments.findIndex(comment => comment.id == args.id);
        if (commentIndex == -1) {
            throw new Error(`comment id ${args.id} not found`);
        }

        return comments.splice(commentIndex, 1)[0];
    },
    deletePost(parent, args) {
        const postIndex = posts.findIndex(post => post.id == args.id);
        if (postIndex == -1) {
            throw new Error(`post id ${args.id} not found`);
        }

        const deletedPost = posts.splice(postIndex, 1)[0];
        comments = comments.filter(comment => comment.post != args.id);
        return deletedPost;
    },
    deleteUser(parent, args) {
        const userIndex = users.findIndex(user => user.id == args.id);
        if (userIndex == -1) {
            throw new Error(`user id ${args.id} not found`);
        }

        const deletedUser = users.splice(userIndex, 1)[0];

        posts = posts.filter(post => {
            const match = post.author == args.id;

            if (match) {
                comments = comments.filter(comment => comment.post != post.id);
            }

            return !match;
        });
        comments = comments.filter(comment => comment.author != args.id);

        return deletedUser;
    },
};

const Comment = {
    author(parent) {
        return users.find(user => user.id == parent.author);
    },
    post(parent) {
        return posts.find(post => post.id == parent.post);
    },
};

const Post = {
    author(parent) {
        return users.find(user => user.id == parent.author);
    },
    comments(parent) {
        return comments.filter(comment => comment.post == parent.id);
    },
};

const User = {
    comments(parent) {
        return comments.filter(comment => comment.author == parent.id);
    },
    posts(parent) {
        return posts.filter(post => post.author == parent.id);
    },
};

const resolvers = { Comment, Mutation, Post, Query, User };
export { resolvers as default };
