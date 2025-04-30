//import { BookDocument } from '../models/Book.js';
import User from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

// Book and User interfaces 
interface Book {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

interface Context {
  user?: {
    _id: string;
    email: string;
    username: string;
  };
}

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');

      const userData = await User.findById(context.user._id).select('-__v -password');
      return userData;
    },

    users: async () => {
      return User.find().select('-__v -password');
    },

    user: async (_parent: unknown, { username }: { username: string }) => {
      return User.findOne({ username }).select('-__v -password');
    },

    searchBooks: async (_parent: unknown, { query }: { query: string }) => {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const { items } = await response.json();

      return items.map((book: any) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || 'No description to display',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || ''
      }));
    }
  },

  Mutation: {
    addUser: async (_parent: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    loginUser: async (_parent: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Invalid email');
      }

      const isPwCorrect = await user.isCorrectPassword(password); 
      if (!isPwCorrect) {
        throw new AuthenticationError('Invalid password');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: unknown, { book }: { book: Book }, context: Context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in for that function!');

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: book } },
        { new: true }
      );

      return updatedUser;
    },

    removeBook: async (_parent: unknown, { bookId }: { bookId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in for that function!');

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      return updatedUser;
    }
  }
};

export default resolvers;
