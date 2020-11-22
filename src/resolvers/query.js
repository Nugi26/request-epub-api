const { ForbiddenError } = require('apollo-server-express');
const searchBooks = require('../gbookapi');

module.exports = {
  users: async (_, args, { db }) => {
    return db('users').select('id', 'username', 'email', 'avatar');
  },

  searchBook: async (_, { keywords }, { db, user }) => {
    const userId = user === undefined ? 0 : user.id;
    try {
      const searchResults = await searchBooks(keywords);
      // make array of gbook_id
      let { items } = searchResults;
      const gbookIds = items.map(item => {
        return item.gbook_id;
      });
      // check on db if results already requested
      const requested = await db('books')
        .select(
          db.raw(
            'books.*, count(books.id) as reqs_count, bool_or(user_request.user_id = ?) as req_by_me',
            [userId]
          )
        )
        .join('user_request', 'books.id', '=', 'user_request.book_id')
        .whereIn('gbook_id', gbookIds)
        .groupBy('books.id');
      // pop any searchResults items that have already requested
      if (requested.length) {
        items.forEach((item, i) => {
          for (const request of requested) {
            if (item.gbook_id === request.gbook_id) items.splice(i, 1);
          }
        });
        // add requested to search result items
        items = [...requested, ...items];
      }

      items.forEach(item => {
        // add id for unrequested items to normalize cache
        if (!item.id) item.id = item.gbook_id;
        // set reqs_count to 0  if is null
        if (!item.reqs_count) item.reqs_count = 0;
      });
      searchResults.items = items;
      return searchResults;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  requestsFeed: async (
    _,
    { pageNumber, orderBy = 'reqs_count', orderDirection },
    { db, user }
  ) => {
    const userId = user === undefined ? 0 : user.id;
    const limitValue = 10;
    // count offset based on page number
    const offsetValue = (pageNumber - 1) * limitValue;
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
        .offset(offsetValue)
        .limit(limitValue)
        .orderBy(orderBy, orderDirection);
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
  getBook: async (_, { id }, { db, user }) => {
    const userId = user === undefined ? 0 : user.id;
    try {
      return await db('books')
        .select(
          db.raw(
            'books.*, count(books.id) as reqs_count, bool_or(user_request.user_id = ?) as req_by_me',
            [userId]
          )
        )
        .join('user_request', 'books.id', '=', 'user_request.book_id')
        .where('books.id', id)
        .groupBy('books.id')
        .first();
    } catch (err) {
      return err;
    }
  },

  me: async (_, args, { db, user }) => {
    if (!user) return new ForbiddenError('Anda tidak sedang log in');
    try {
      return await db('users').where('id', user.id).first();
    } catch (err) {
      return err;
    }
  },

  getSomeBooks: async (_, { books }, { db, user }) => {
    const userId = user === undefined ? 0 : user.id;
    try {
      const test = await db('books')
        .select(
          db.raw(
            'books.*, count(books.id) as reqs_count, bool_or(user_request.user_id = ?) as req_by_me',
            [userId]
          )
        )
        .join('user_request', 'books.id', '=', 'user_request.book_id')
        .whereIn('books.id', books)
        .groupBy('books.id');
      console.log(test);
      return test;
    } catch (err) {
      return err;
    }
  },
  hello: async () => {
    console.log('hello');
    return 'hello world';
  },
};
