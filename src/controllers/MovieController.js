const knex = require("../database/knex");
const AppError = require("../utils/AppError");


class MovieController {


  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id;


    if(title.length <= 0) {
      throw new AppError("O filme deve conter um título para ser adicionado.");
    };

    if(rating < 0 || rating > 5) {
      throw new AppError("As avaliações devem ser atribuídas em uma escala de zero a cinco.");
    };


    const movie = {
      title,
      description: description.length > 0 ? description : null,
      rating,
      user_id
    };


    const [ movie_id ] = await knex("movies").insert(movie);


    if(tags.length > 0) {
      
      const structuredTags = tags.map(tagNAME => {
        return {

          name: tagNAME,
          movie_id,
          user_id

        };
      });

      await knex("tags").insert(structuredTags);
    };

    
    return response.status(200).json({
      status: "OK",
      message: "Filme adicionado com sucesso.",
    });
  };


  async update(request, response) {
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id;
    const { movie_id } = request.query;


    const movie = await knex("movies").where({ id: movie_id }).first();

    if(!movie) {
      throw new AppError("Filme ainda não encontrado.")
    };


    if(title.length <= 0) {
      throw new AppError("O filme deve conter um título para ser adicionado.");
    };

    if(rating < 0 || rating > 5) {
      throw new AppError("As avaliações devem ser atribuídas em uma escala de zero a cinco.");
    };


    const movieUpdated = {
      
      title,
      description,
      rating,

    };
    

    await knex("movies").where({ id: movie.id }).update(movieUpdated);


    if(tags.length > 0) {
      
      const structuredTags = tags.map(tagNAME => {
        return {

          name: tagNAME,
          movie_id,
          user_id

        };
      });


      const checkTagExists = await knex("tags").where({ movie_id, user_id }).first()

      if(checkTagExists) {
        await knex("tags").where({ movie_id: movie.id, user_id }).del();
      }

      await knex("tags").insert(structuredTags);
    };


    return response.status(200).json({
      status: "OK.",
      message: "Filme atualizado com sucesso."
    })
  };


  async index(request, response) {
    const { title, movie_id } = request.query;
    const user_id = request.user.id;

    let movies = [];


    if(title.length > 0 && !movie_id) {

      const searchMoviesTitle = await knex("movies")
        .select("id", "title", "rating", "description")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");

      
      movies = searchMoviesTitle;
    };


    if(movie_id && title.length <= 0) {

      const searchMovieId = await knex("movies").where({ id: movie_id, user_id });

      if(!searchMovieId) {
        throw new AppError("Filme não encontrado.");
      };


      movies = searchMovieId;
    };


    if(!movie_id && title.length <= 0) {

      const searchMovieUser_id = await knex("movies")
        .select("id", "title", "description", "rating")
        .where({ user_id });
      
        movies = searchMovieUser_id;
    };



    if(movies.length > 0) {

      for(let i = 0; i < movies.length; i ++) {

        const tags = await knex("tags").where({ movie_id: movies[i].id, user_id });
        movies[i].tags = tags;
      };
    };



    return response.status(200).json({
      status: "OK.",
      message: "Filmes encontrados com sucesso.",
      movies
    });
  };


  async delete(request, response) {
    const { movie_id } = request.query;
    const user_id = request.user.id;


    const movie = await knex("movies").where({ id: movie_id, user_id }).first();

    if(!movie) {
      throw new AppError("Filme não encontrado.");
    };


    await knex("movies").where({ id: movie.id, user_id }).delete();


    response.status(200).json({
      status: "OK.",
      message:"Filme deletado com sucesso."
    });
  };
};


module.exports = MovieController;