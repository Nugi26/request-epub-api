module.exports = {
  // resolve requests_count for a book
  requests_count: async (book, args, { db }) => {
    try {
      return await db('user_request')
        .count('book_id')
        .where('book_id', book.id)
        .first()
        .then(res => res.count);
    } catch (err) {
      return err;
    }
  },
  requestedId: async (book, args, { db }) => {
    try {
      // check if gbookapi_id exists in books table
      return await db('books')
        .select('id')
        .where('gbook_id', book.gbook_id)
        .first()
        .then(res => (res !== undefined ? res.id : undefined));
    } catch (err) {
      return err;
    }
  },
  requestedByMe: async (book, args, { db, user }) => {
    if (!user) return false;
    try {
      const exist = await db('user_request')
        .where({ book_id: book.id, user_id: user.id })
        .first();
      return !!exist;
    } catch (err) {
      return err;
    }
  },
};
