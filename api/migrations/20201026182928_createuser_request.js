// create user_request join table
exports.up = function (knex) {
  return knex.schema.createTable("user_request", (table) => {
    table.integer("user_id").references("id").inTable("users");
    table.integer("book_id").references("id").inTable("books");
    table.unique(["user_id", "book_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_request");
};
