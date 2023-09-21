const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");


function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;


  if(!authHeader) {
    throw new AppError("Token de identificação inválido1", 401);
  };


  const [, token] = authHeader.split(" ");


  try {
    const { sub: user_id } = verify(token, authConfig.jtw.secret);

    
    request.user = {
      id: Number(user_id)
    };


    return next();

  }catch {

    throw new AppError("Token de identificação inválido2", 401);
  };
};


module.exports = ensureAuthenticated;