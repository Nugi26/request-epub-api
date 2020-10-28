const searchBooks = require("../src/gbookapi");
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  // await knex("books").del();
  // get books data from gbook api
  const { items } = await searchBooks("machine learning", 3);
  // Inserts seed entries
  return knex("books").insert(items);
};
