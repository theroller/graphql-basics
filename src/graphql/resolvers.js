import uuidv4 from 'uuid/v4';

const Query = {
    comments(parent, args, { db }) {
        return db.comments;
    },
    me(parent, args, { db }) {
        return db.users[0];
    },
    post(parent, args, { db }) {
        return db.posts[0];
    },
    posts(parent, args, { db }) {
        if (args.query) {
            const re = new RegExp(args.query.toLowerCase());
            return db.posts.filter(x => re.test(x.title.toLowerCase()) || re.test(x.body.toLowerCase()));
        }
        return db.posts;
    },
    users(parent, args, { db }) {
        if (args.query) {
            const re = new RegExp(args.query.toLowerCase());
            return db.users.filter(x => re.test(x.name.toLowerCase()));
        }
        return db.users;
    },
};

const Mutation = {
    createComment(parent, args, { db }) {
        const author = db.users.find(user => user.id == args.data.author);
        if (!author) {
            throw new Error('author not found');
        }
        const post = db.posts.find(post => post.id == args.data.post && post.published);
        if (!post) {
            throw new Error('published post not found');
        }

        const comment = { id: uuidv4(), ...args.data };
        db.comments.push(comment);

        return comment;
    },
    createPost(parent, args, { db }) {
        const author = db.users.find(user => user.id == args.data.author);
        if (!author) {
            throw new Error('author not found');
        }

        const post = { id: uuidv4(), ...args.data };
        db.posts.push(post);

        return post;
    },
    createUser(parent, args, { db }) {
        let user = db.users.find(user => user.email === args.data.email);
        if (user) {
            throw new Error('email taken');
        }

        user = { id: uuidv4(), ...args.data };
        db.users.push(user);

        return user;
    },
    deleteComment(parent, args, { db }) {
        const commentIndex = db.comments.findIndex(comment => comment.id == args.id);
        if (commentIndex == -1) {
            throw new Error(`comment id ${args.id} not found`);
        }

        return db.comments.splice(commentIndex, 1)[0];
    },
    deletePost(parent, args, { db }) {
        const postIndex = db.posts.findIndex(post => post.id == args.id);
        if (postIndex == -1) {
            throw new Error(`post id ${args.id} not found`);
        }

        const deletedPost = db.posts.splice(postIndex, 1)[0];
        db.comments = db.comments.filter(comment => comment.post != args.id);
        return deletedPost;
    },
    deleteUser(parent, args, { db }) {
        const userIndex = db.users.findIndex(user => user.id == args.id);
        if (userIndex == -1) {
            throw new Error(`user id ${args.id} not found`);
        }

        const deletedUser = db.users.splice(userIndex, 1)[0];

        db.posts = db.posts.filter(post => {
            const match = post.author == args.id;

            if (match) {
                db.comments = db.comments.filter(comment => comment.post != post.id);
            }

            return !match;
        });
        db.comments = db.comments.filter(comment => comment.author != args.id);

        return deletedUser;
    },
};

const Comment = {
    author(parent, args, { db }) {
        return db.users.find(user => user.id == parent.author);
    },
    post(parent, args, { db }) {
        return db.posts.find(post => post.id == parent.post);
    },
};

const Post = {
    author(parent, args, { db }) {
        return db.users.find(user => user.id == parent.author);
    },
    comments(parent, args, { db }) {
        return db.comments.filter(comment => comment.post == parent.id);
    },
};

const User = {
    comments(parent, args, { db }) {
        return db.comments.filter(comment => comment.author == parent.id);
    },
    posts(parent, args, { db }) {
        return db.posts.filter(post => post.author == parent.id);
    },
};

const resolvers = { Comment, Mutation, Post, Query, User };
export { resolvers as default };
