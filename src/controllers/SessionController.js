const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");

const { sign } = require("jsonwebtoken");
const authConfig = require("../configs/auth");


class SessionController {

  async create(request, response) {

    const { email, password } = request.body;

    if(!email || !password) {
      throw new AppError("Preencha todos os campos para autenticar.");
    };


    const user = await knex("users").where({ email }).first();

    if(!user) {
      throw new AppError("Email/Senha incorreta.");
    };


    const checkPassword = await compare(password, user.password);

    if(!checkPassword) {
      throw new AppError("Email/Senha incorreta.");
    };


    const { secret, expiresIn } = authConfig.jtw;


    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    });


    response.status(200).json({
      status: "OK.",
      message: "Autenticação realizada com sucesso.",
      user,
      token
    });

  };
};


module.exports = SessionController;