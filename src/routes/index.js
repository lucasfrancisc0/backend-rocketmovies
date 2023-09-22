
const { Router } = require("express");

const userRoutes = require("./user.routes");
const sessionRoutes = require("./session.routes");
const movieRoutes = require("./movie.routes");



const routes = Router();

//routes
routes.use("/users", userRoutes);
routes.use("/session", sessionRoutes);
routes.use("/movies", movieRoutes);


module.exports = routes;