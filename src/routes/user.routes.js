const { Router } = require("express");
const UserController = require("../controllers/UserController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");


const userRoutes = Router();
const userController = new UserController();


userRoutes.post("/", userController.create);
userRoutes.put("/", ensureAuthenticated, userController.update);
userRoutes.get("/", ensureAuthenticated, userController.index);


module.exports = userRoutes;