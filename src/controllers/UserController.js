class UserController {
  
  async create(request, response) {
    const { name, email, password } = request.body;

    const user = {
      name,
      email,
      password
    };

    response.status(200).json({
      status: "OK.",
      message: "Usuário criado com sucesso.",
      user
    });
  };
};


module.exports = UserController;