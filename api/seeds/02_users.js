exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex("users").del();
  // Inserts seed entries
  const users = ["nugi", "budi", "ichsan", "yudhi", "rizky", "sugiyo"];
  const usersData = users.map((username) => {
    return {
      username,
      email: `${username}@example.com`,
      password: "password",
      avatar: `${username}Avatar`,
    };
  });
  return knex("users").insert(usersData);
};
