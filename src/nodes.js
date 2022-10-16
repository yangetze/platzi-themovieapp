const $ = (id) => document.querySelector(id);

const body = $("body");

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
const selectedMovieGenres = movieSelected.querySelector(
  "#selectedMovie_genres"
);
const selectedMovieReleaseDate = movieSelected.querySelector(
  "#selectedMovie_releaseDate"
);
const selectedMovieTitle = movieSelected.querySelector("#selectedMovie_title");
const selectedMovieImg = movieSelected.querySelector("#selectedMovie_img");
const selectedMovieOverview = movieSelected.querySelector(
  "#selectedMovie_overview"
);
const selectedMoviePopularity = movieSelected.querySelector(
  "#selectedMovie_popularity"
);

const watchProviderRent = $("#watchProvider_Rent");
