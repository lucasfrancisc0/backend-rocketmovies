const knex = require("../database/knex");

class UserRepository {
  async findByEmail(email){
    const user = await knex("users").where({ email }).first();

    return user;
  }

  async create(user){
    const userId = await knex("users").insert(user);

    return { id: userId };
  }


};

module.exports = UserRepository;