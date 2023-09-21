
exports.up = knex => knex.schema.createTable("movies", table => {
  table.increments("id");

  table.string("title").notNullable();
  table.text("description").nullable();
  table.text("rating").nullable();

  table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
  
  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("movies");