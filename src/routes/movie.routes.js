const { Router } = require("express");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const MovieController = require("../controllers/MovieController");


const movieRoutes = Router();
const movieController = new MovieController();

movieRoutes.use(ensureAuthenticated);

movieRoutes.post("/", movieController.create);
movieRoutes.put("/", movieController.update);
movieRoutes.get("/", movieController.index);
movieRoutes.delete("/", movieController.delete);


module.exports = movieRoutes;