const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID!
        authors: [String]!
        description: String
        title: String!
        image: String
        link: String
    }

    type Auth {
        token: String!
        user: User!    
    }

    input BookInput {
        bookId: ID!
        authors: [String]!
        description: String
        title: String!
        image: String
        link: String
    }

    input AddUserInput {
        username: String!
        email: String!
        password: String!
    }

    input RemoveBookInput {
        bookId: ID!
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(input: AddUserInput!): Auth
        saveBook(book: BookInput!): User
        removeBook(book: RemoveBookInput!): User    
    }
`

export default typeDefs