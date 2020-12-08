const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
require('dotenv').config();
const { url: gravatar } = require('gravatar');
const searchBooks = require('../gbookapi');

module.exports = {
  addReq: async (_, { book }, { db, user }) => {
    if (!user) throw new AuthenticationError('Anda belum Sign in!');
    let output;
    try {
      // check if book already exists in books table
      let bookExists;
      // TODO
      if (!!book.gbook_id) {
        bookExists = await db('books')
          .select('id')
          // TODO:
          .where('gbook_id', book.gbook_id)
          .first();
      }

      // make a transaction mutation for add book record to books table and add user request record to user_request table
      await db.transaction(async trx => {
        let addedBookId;
        // if book not exist, add book to books table
        if (!bookExists) {
          addedBookId = await trx('books')
            .insert(book)
            .returning('id')
            .then(res => res[0]);
        }

        // add  user_request record
        const userReqRecord = await trx('user_request')
          .insert(
            {
              user_id: user.id,
              book_id: addedBookId || bookExists.id,
            },
            ['book_id']
          )
          .then(res => {
            output = res[0].book_id;
            return;
          });
      });

      return output;
    } catch (err) {
      return new ForbiddenError(err);
    }
  },

  signUp: async (parent, { username, email, password }, { db }) => {
    if (!username || !email || !password)
      return new AuthenticationError('harap isi semua kolom');
    // normalize username and email address
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();
    // hash the password
    const hashed = await bcrypt.hash(password, 10);
    // create the gravatar url
    const avatar = gravatar(email);

    try {
      // crete user's record
      const user = await db('users')
        .insert({ username, email, password: hashed, avatar })
        .returning('id')
        .then(id => {
          return jwt.sign({ id: id[0] }, process.env.JWT_SECRET);
        });
      return user;
    } catch (err) {
      console.log(err);
      if (err.code === '23505')
        return new Error('Username atau Password telah dipakai');
      return new Error('Error creating account');
    }
  },

  signIn: async (_, { usernameOrEmail, password }, { db }) => {
    if (!usernameOrEmail || !password)
      return new AuthenticationError(
        'username/email dan password harus diisi!'
      );
    if (usernameOrEmail) {
      // normalize username or email
      usernameOrEmail = usernameOrEmail.trim().toLowerCase();
    }
    // get user's record
    const user = await db('users')
      .select('id', 'password')
      .where('username', usernameOrEmail)
      .orWhere('email', usernameOrEmail)
      .first();
    // if no user is found, throw an authentication error
    if (!user) {
      throw new AuthenticationError('username atau email Anda tidak terdaftar');
    }
    // if the passwords don't match, throw an authentication error
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Password Anda salah');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return token;
  },

  deleteReq: async (_, { bookId }, { db, user }) => {
    if (!user) throw new AuthenticationError('Anda belum sign in!');
    try {
      await db.transaction(async trx => {
        // delete user request record from user_request table
        await trx('user_request')
          .where({ user_id: user.id, book_id: bookId })
          .del();

        // check book req count
        const reqCount = await trx('user_request')
          .count('book_id')
          .where('book_id', bookId)
          .first()
          .then(res => res.count);

        // if reqCount is 0, also delete book entry from books table
        // FYI, reqCount is a string! weird...
        if (reqCount === '0') {
          await trx('books').where('id', bookId).del();
        }
      });
      return bookId;
    } catch (err) {
      return err;
    }
  },
};
