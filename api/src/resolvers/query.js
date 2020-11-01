const { ForbiddenError } = require("apollo-server-express");
const searchBooks = require("../gbookapi");

module.exports = {
  users: async (_, args, { db }) => {
    return db("users").select("id", "username", "email", "avatar");
  },

  searchBook: async (_, { keywords }) => {
    try {
      return await searchBooks(keywords);
    } catch (err) {
      return new ForbiddenError(err.message);
    }
  },

  getAllReqs: async (_, args, { db }) => {
    try {
      return await db("books");
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  // TODO: getUserReqs()

  getBook: async (_, { id }, { db }) => {
    try {
      return await db("books").where("books.id", id).first();
    } catch (err) {
      return err;
    }
  },
};
