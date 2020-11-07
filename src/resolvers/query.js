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

  requestsFeed: async (_, args, { db, user }) => {
    const userId = user === undefined ? 0 : user.id;
    try {
      const requests = await db('books')
        .select(
          db.raw(
            'books.*, count(id) as reqs_count, bool_or(user_request.user_id = ?) as req_by_me',
            [userId]
          )
        )
        .join('user_request', 'books.id', '=', 'user_request.book_id')
        .groupBy('books.id')
        .orderBy('reqs_count', 'desc');
      const totalReqs = await db('books')
        .count('id')
        .then(res => parseInt(res[0].count));
      return { totalReqs, requests };
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
