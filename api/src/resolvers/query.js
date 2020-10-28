const { ForbiddenError } = require("apollo-server-express");
const searchBooks = require("../gbookapi");

module.exports = {
  hello: () => "testing",
  users: async (_, args, { db }) => {
    return db("users").select("id", "username", "email", "avatar");
  },

  searchbook: async (_, { keywords }) => {
    try {
      return await searchBooks(keywords);
    } catch (err) {
      return new ForbiddenError(err.message);
    }
  },

  getallreqs: async (_, args, { db }) => {
    try {
      return await db("books");
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  getbook: async (_, { id }, { db }) => {
    try {
      return await db("books").where("books.id", book.id).first();
    } catch (err) {
      return err;
    }
  },
};
