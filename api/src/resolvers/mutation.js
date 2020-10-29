const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
require("dotenv").config();
const gravatar = require("gravatar").url;
const searchBooks = require("../gbookapi");

module.exports = {
  addNewBookEntry: async (_, { book, userId }, { db }) => {
    // get dummy book data from gbookApi
    // TODO: delete on production!
    const { items } = await searchBooks("postgresql", 1);
    const dummyBook = items[0];
    try {
      // add book to books table
      const addedBook = await db("books")
        // TODO: Don't forget to change dummyBook to book !
        .insert(dummyBook)
        .returning("*")
        .then((res) => res[0]);

      // add  user_request record
      const userReqRecord = await db("user_request").insert({
        user_id: userId,
        book_id: addedBook.id,
      });
      return addedBook;
    } catch (err) {
      return new ForbiddenError(err.message);
    }
  },
  addReq: async (_, { userId, bookId }, { db }) => {
    // add req to a listed book
    try {
      await db("user_request").insert({
        user_id: userId,
        book_id: bookId,
      });
      return true;
    } catch (err) {
      return err;
    }
  },

  signUp: async (parent, { username, email, password }, { db }) => {
    // normalize email address
    email = email.trim().toLowerCase();
    // hash the password
    const hashed = await bcrypt.hash(password, 10);
    // create the gravatar url
    const avatar = gravatar(email);

    try {
      // crete user's record
      const user = await db("users")
        .insert({ username, email, password: hashed, avatar })
        .returning("id")
        .then((id) => {
          return jwt.sign({ id }, process.env.JWT_SECRET);
        });
      return user;
    } catch (err) {
      console.log(err);
      if ((err.code = "23505"))
        return new Error("Username atau Password telah dipakai");
      throw new Error("Error creating account");
    }
  },
};
