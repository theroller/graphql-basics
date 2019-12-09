import { GraphQLServer } from 'graphql-yoga';

import db from './db';
import resolvers from './graphql/resolvers';

const server = new GraphQLServer({
    context: {
        db,
    },
    typeDefs: './src/graphql/schema.graphql',
    resolvers,
});

server.start(() => {
    console.log('server is up');
});
