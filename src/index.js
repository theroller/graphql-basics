import { GraphQLServer } from 'graphql-yoga';

import db from './db';
import Query from './resolvers/query';
import Mutation from './resolvers/mutation';
import Comment from './resolvers/comment';
import Post from './resolvers/post';
import User from './resolvers/user';

const resolvers = {
    Query,
    Mutation,
    Comment,
    Post,
    User,
};

const server = new GraphQLServer({
    context: {
        db,
    },
    typeDefs: './src/schema.graphql',
    resolvers,
});

server.start(() => {
    console.log('server is up');
});
