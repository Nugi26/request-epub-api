//up is for the action we want to do, run on knex migrate:latest
// down is the opposite thing that we are doing, run on knex migrate:rollback
// in this case, i wanna create table, so the opposite would be drop table
// up and down could be used as 'undo' and 'redo' actions.

// create books table
exports.up = function (knex) {
  return knex.schema.createTable("books", (table) => {
    table.increments("id");
    table.text("gbook_id").unique();
    table.string("title", 200).notNullable();
    table.string("subtitle", 200);
    table.specificType("authors", "text[]");
    table.string("publisher", 100);
    table.string("published_date", 12);
    table.text("description");
    table.integer("page_count");
    table.string("maturity_rating", 30);
    table.text("small_thumbnail");
    table.text("thumbnail");
    table.string("average_rating", 4);
    table.integer("ratings_count");
    table.unique(["title", "subtitle", "authors"]);
  });
};

// drop books table
exports.down = function (knex) {
  return knex.schema.dropTable("books");
};
