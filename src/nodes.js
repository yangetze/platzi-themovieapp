const $ = (id) => document.querySelector(id);

const searchInput = $("#searchInput");
const searchBtn = $("#searchBtn");

const searchSection = $("#search");
const topUsersSection = $("#topUsers");
const trendingSection = $("#trending");
const genreSection = $("#genres");
const genresList = $("#genresList");
const popularMoviesByGenreSection = $("#popularMoviesByGenre");
const topRatedUsersList = $("#topRatedUsersList");
const trendingMovieList = $("#trendingMovieList");
const popularMoviesByGenreList = $("#popularMoviesByGenreList");
const popularMoviesHelpText =
  popularMoviesByGenreSection.querySelector("#helpText");
const movieSelected = $("#movieSelected");
const selectedMovie_genres = movieSelected.querySelector(
  "#selectedMovie_genres"
);
