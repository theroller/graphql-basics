const Query = {
    add(parent, args) {
        return args.a + args.b;
    },
    greeting(parent, args) {
        if (args.name) {
            return `yo, ${args.name}!`;
        }
        return 'yo';
    },
    me() {
        return {
            id: '123099',
            name: 'Pete',
            email: 'pete@gmail.com',
            age: 44,
        };
    },
    post() {
        return {
            id: '44459',
            title: 'JZ',
            body: 'lorem ipsum',
            published: true,
        };
    },
};

const resolvers = { Query };
export { resolvers as default };
