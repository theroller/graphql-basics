import { GraphQLServer } from 'graphql-yoga';

// Type Definitions (schema)
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`;


// Resolvers
const resolvers = {
    Query: {
        id() {
            return 'abc-123';
        },
        name() {
            return 'James';
        },
        age() {
            return 27;
        },
        employed() {
            return true;
        },
        gpa() {
            return 3.01;
        },
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => {
    console.log('server is up');
});
