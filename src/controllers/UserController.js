const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");


class UserController {
  

  async create(request, response) {
    const { name, email, password } = request.body;


    if(!name || !email || !password) {
      throw new AppError("Preencha todos os campos para o cadastramento de um novo usuário.");
    };


    const checkEmailExists = await knex("users").where({ email }).first();

    if(checkEmailExists) {
      throw new AppError("Este email já esta em uso.");
    };


    if(name.length <= 2) {
      throw new AppError("Nomes de usuário devem conter no mínimo 3 caracteres.");
    };


    if(password.length <= 2) {
      throw new AppError("Senha muito fraca.");
    };


    const hashedPassword = await hash(password, 8);


    const user = {
      name,
      email,
      password: hashedPassword
    };


    await knex("users").insert(user);


    return response.status(200).json({
      status: "OK.",
      message: "Usuário criado com sucesso.",
    });
  };


  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;


    const user = await knex("users").where({ id: user_id }).first();

    if(!user) {
      throw new AppError("Usuário não encontrado.");
    };


    user.name = name ?? user.name;


    if(email !== user.email || password.length > 0) {

      if(old_password.length <= 0) {
        throw new AppError("É necessário informar a senha antiga para a alteração de dados.");
      };

      const checkPassword = await compare(old_password, user.password);

      if(!checkPassword) {
        throw new AppError("Senha incorreta.");
      };
    };


    if(email !== user.email) {

      const checkEmailExists = await knex("users")
        .select("name")
        .where({ email })
        .first();


      if(checkEmailExists) {
        throw new AppError("Este email já esta sendo usado.");
      };


      user.email = email;
    };


    if(password.length > 0) {

      if(password.length <= 2) {
        throw new AppError("Senha muito fraca.");
      };


      const hashedPassword = await hash(password, 8);
      user.password = hashedPassword;
    };


    await knex("users").where({ id: user.id }).update(user);
    

    return response.status(200).json({
      status: "OK.", 
      message: "Usuário atualizado com sucesso.",
    });
  };


  async index(request, response) {
    const user_id = request.user.id;


    const user = await knex("users")
      .select("name", "email", "avatar", "created_at", "updated_at")
      .where({ id: user_id })
      .first();

    if(!user) {
      throw new AppError("Usuário não econtrado.");
    };


    return response.status(200).json({
      status: "OK.",
      message: "Usuário encontrado com sucesso.",
      user
    });
  };

  
  async delete(request, response) {
    const { old_password } = request.body;
    const user_id = request.user.id;


    const user = await knex("users").where({ id: user_id }).first();

    if(!user) {
      throw new AppError("Usuário não encotrado.");
    };


    if(!old_password) {
      throw new AppError("É necessário a senha para a exclusão de conta.");
    };


    const checkPassword = await compare(old_password, user.password);

    if(!checkPassword) {
      throw new AppError("Senha incorreta.");
    };


    await knex("users").where({ id: user.id }).delete();


    return response.status(200).json({
      status: "OK.",
      message: "Usuário deletado com sucesso."
    });
  };
};


module.exports = UserController;