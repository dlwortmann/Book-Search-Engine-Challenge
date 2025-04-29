import { BookDocument } from '../models/Book';
import User from '../models/index.js'
import { signToken, AuthenticationError } from "../services/auth";

// created interfaces 
interface Book {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: [BookDocument];
  bookCount: number;
}

interface UsernameArgs {
    username: string
}

interface Context {
    user?: User
    book?: Book
}

interface AddUserArgs{
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface BookInputArgs {
    bookInput: {
        bookId: string;
        title: string;
        authors: string[];
        description: string;
        image: string;
        link: string;
    }
}

interface RemoveBookArgs {
    book: {
        bookId: string
    }
}

// create resolvers for each method
const resolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: Context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                console.log(userData)
                return userData;    
            }
            throw new AuthenticationError('Not logged in')
        },
        
        users: async () => {
            return User.find().select('-__v -password').populate('book')
        },

        user: async (_parent: unknown, { username }: UsernameArgs) => {
            return User.findOne({ username })
                .select('-__v -password')
                
        },
    },


    Mutation: {
        addUser: async (_parent: unknown, { input }: AddUserArgs) => {
            const user = await User.create(input)
            const token = signToken(user.username, user.email, user._id)
            return { token, user }
        },

        login: async (_parent: unknown, { email, password }: {  email: string; password: string }) => {
            const user = await User.findOne({ email }).select('-__v -password')
            if (!user) {
                throw new AuthenticationError('Invalid username')
            }
            const correctPassword = await user.isCorrectPassword(password)
            if (!correctPassword) {
                throw new AuthenticationError('Invalid password')
            }
            const token = signToken(user.username, user.email, user._id)
            return { token, user }
        },

        saveBook: async (_parent: unknown, { bookInput }: BookInputArgs, context: Context) => {
            // console.log(context.user)
            // console.log(bookInput)
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {savedBooks: bookInput } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You must be logged in for that function!')
        },

        removeBook: async (_parent: unknown, { book }: RemoveBookArgs, context: Context): Promise<User | null> => {
            if (context.user) {
                return await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: book.bookId} } },
                    { new: true }
                )
            }
            throw new AuthenticationError('You must be logged in for that function!')
        },   
    }
};

export default resolvers