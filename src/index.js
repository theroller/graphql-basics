import { GraphQLServer } from 'graphql-yoga';
import fs from 'fs';

const typeDefs = fs.readFileSync('./src/graphql/schema.gql').toString();
import resolvers from './graphql/resolvers';

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => {
    console.log('server is up');
});
