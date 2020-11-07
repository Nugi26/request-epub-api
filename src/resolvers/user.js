module.exports = {
  // resolves requests from user parent
  requests: async (user, args, { db, user: loggedInUser }) => {
    const loggedInUserId = loggedInUser === undefined ? 0 : loggedInUser.id;
    try {
      return await db('books')
        .select(
          db.raw(
            'books.*, count(user_request.user_id) as reqs_count, bool_or(user_request.user_id = ?) as req_by_me',
            [loggedInUserId]
          )
        )
        .join('user_request', 'user_request.book_id', '=', 'books.id')
        .whereIn('books.id', function () {
          this.select('book_id').from('user_request').where('user_id', user.id);
        })
        .groupBy('books.id');
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};
