const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash } = require("bcryptjs");


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


    response.status(200).json({
      status: "OK.",
      message: "Usuário criado com sucesso.",
    });
  };

};


module.exports = UserController;