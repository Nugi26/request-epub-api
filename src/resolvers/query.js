const { ForbiddenError } = require('apollo-server-express');
const searchBooks = require('../gbookapi');

module.exports = {
  users: async (_, args, { db }) => {
    return db('users').select('id', 'username', 'email', 'avatar');
  },

  searchBook: async (_, { keywords }) => {
    console.log('searchBooks triggered');
    try {
      return await searchBooks(keywords);
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  getAllReqs: async (_, args, { db }) => {
    try {
      return await db('books');
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  getUser: async (_, { id }, { db }) => {
    try {
      return await db('users')
        .select('id', 'username', 'email', 'avatar')
        .where({ id })
        .first();
    } catch (err) {
      return err;
    }
  },
  getBook: async (_, { id }, { db }) => {
    try {
      return await db('books').where('books.id', id).first();
    } catch (err) {
      return err;
    }
  },

  me: async (_, args, { db, user }) => {
    try {
      return await db('users').where('id', user.id).first();
    } catch (err) {
      return err;
    }
  },
  hello: async () => {
    console.log('hello');
    return 'hello world';
  },
};
