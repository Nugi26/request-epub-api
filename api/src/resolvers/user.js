module.exports = {
  // resolves requests from user parent
  requests: async (user, args, { db }) => {
    try {
      const userReqs = await db("user_request")
        .join("books", "user_request.book_id", "=", "books.id")
        .select("books.id", "books.gbook_id", "books.title", "books.subtitle")
        .where("user_request.user_id", user.id);
      return userReqs;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};
