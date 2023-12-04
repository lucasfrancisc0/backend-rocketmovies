const AppError = require("../utils/AppError");
const { hash } = require("bcryptjs");

class UserCreateService {

  constructor(userRepository){
    this.userRepository = userRepository;    
  }

  async execute({ name, email, password }){

    if(!name || !email || !password) {
      throw new AppError("Preencha todos os campos para o cadastramento de um novo usuário.");
    };

    const checkEmailExists = await this.userRepository.findByEmail(email);

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


    const userCreated = await this.userRepository.create(user);

    return userCreated;

  }

};

module.exports = UserCreateService;