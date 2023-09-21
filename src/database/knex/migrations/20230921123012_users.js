
exports.up = knex => knex.schema.createTable("users", table => {
  table.increments("id");

  table.string("name").notNullable();
  table.text("email").notNullable();
  table.text("password").notNullable();
  table.text("avatar").nullable();
  
  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updtaed_at").default(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("users");