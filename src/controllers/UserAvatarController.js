const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const DiskStorage = require("../providers/DiskStorage")


class UserAvatarController {

  async update(request, response) {
    const avatarFilename = request.file.filename; 
    const user_id = request.user.id;

    const diskStorage = new DiskStorage;


    const user = await knex("users").where({ id: user_id }).first();

    if(!user) {
      throw new AppError("usuário não encontrado");
    };

    if(user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    };


    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;


    await knex("users").where({ id: user_id }).update(user);


    return response.status(200).json({
      status: "OK.",
      message: "Avatar de usuário atualizado com sucesso.",
      avatar: user.avatar
    });
  };
};


module.exports = UserAvatarController;