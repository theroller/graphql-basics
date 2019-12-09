import uuidv4 from 'uuid/v4';

const Mutation = {
    createComment(parent, args, { db, pubsub }) {
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

        pubsub.publish(`comment-${args.data.post}`, { comment });

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
    updateComment(parent, { id, data }, { db }) {
        const comment = db.comments.find(comment => comment.id == id);
        if (!comment) {
            throw new Error(`comment id ${id} not found`);
        }

        if (typeof data.text === 'string') {
            comment.text = data.text;
        }

        return comment;
    },
    updatePost(parent, { id, data }, { db }) {
        const post = db.posts.find(post => post.id == id);
        if (!post) {
            throw new Error(`post id ${id} not found`);
        }

        if (typeof data.body === 'string') {
            post.body = data.body;
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;
        }

        if (typeof data.title === 'string') {
            post.title = data.title;
        }

        return post;
    },
    updateUser(parent, { id, data }, { db }) {
        const user = db.users.find(user => user.id == id);
        if (!user) {
            throw new Error(`user id ${id} not found`);
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email);
            if (emailTaken) {
                throw new Error(`email ${data.email} taken`);
            }
            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age;
        }

        return user;
    },
};

export { Mutation as default };
