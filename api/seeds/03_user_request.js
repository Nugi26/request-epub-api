exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_request")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_request").insert([
        { user_id: 61, book_id: 1 },
        { user_id: 61, book_id: 11 },
        { user_id: 61, book_id: 12 },
        { user_id: 61, book_id: 17 },
        { user_id: 62, book_id: 1 },
        { user_id: 62, book_id: 3 },
        { user_id: 62, book_id: 5 },
        { user_id: 63, book_id: 5 },
        { user_id: 64, book_id: 5 },
        { user_id: 64, book_id: 13 },
        { user_id: 64, book_id: 17 },
        { user_id: 64, book_id: 18 },
      ]);
    });
};
