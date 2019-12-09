const Subscription = {
    comment: {
        subscribe(parent, { postID }, { db, pubsub }) {
            const post = db.posts.find(post => post.id == postID && post.published);

            if (!post) {
                throw new Error(`post id ${postID} not found`);
            }

            return pubsub.asyncIterator(`comment-${postID}`);
        }
    },
    count: {
        subscribe(parent, args, { pubsub }) {
            let count = 0;

            setInterval(() => {
                count++;
                pubsub.publish('count', { count });
            }, 1000);

            return pubsub.asyncIterator('count');
        }
    },
    post: {
        subscribe(parent, args, { pubsub }) {
            return pubsub.asyncIterator('post');
        }
    }
};

export { Subscription as default };
