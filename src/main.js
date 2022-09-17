const token = config.TOKEN_AUTH_V4;
const key = config.API_KEY;
const UrlBase = "https://api.themoviedb.org/3/";

const genre = "genre/";
const genre_movie_list = "movie/list";

const instance = axios.create({
  baseURL: UrlBase,
  headers: { "X-API-KEY": key },
});

async function get_genres_movies_list() {
  const { data, status } = await instance
    .get(genre + genre_movie_list)
    .catch(function (error) {
      errorMessage(error.toJSON());
    });

  console.log("get_genres_movies_list ", status);
  console.log(data);
}


get_genres_movies_list();