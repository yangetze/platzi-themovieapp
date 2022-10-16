const token = config.TOKEN_AUTH_V4;
const key = config.API_KEY;
const UrlBase = "https://api.themoviedb.org/3";
const query_APIKey = "?api_key=" + key;
const SeparatorComma = ", ";

// #region feature: Genre
const genre = "/genre";
const genre_movie_list = `${genre}/movie/list`;
// #endregion

// #region feature: Movie
const movie = "/movie";
const movie_popular_list = `${movie}/popular`;
const movie_topRated_list = `${movie}/top_rated`;

let watchProviderUS;
let watchProviderVE;
// #endregion

// #region feature: Trending
const trending = UrlBase + "/trending";
const trendingTimeWindow = ["day", "week"];
const trendingMediaTypes = ["all", "movie", "tv", "person"];
// #endregion

// #region feature: search
const searchMovie = "/search/movie";
// #endregion
const example = "https://api.themoviedb.org/3/movie/550?api_key=" + key;
const spanError = document.getElementById("error");

let popularMovies;
let fullMovie;
let trendingMovies;
let watchProvider;
let topRated;
let searchMovieResults;

const api = axios.create({
  baseURL: UrlBase,
  https: httpHeaders,
  params: {
    api_key: config.API_KEY,
  },
});

async function getGenres() {
  const { data, status } = await api.get(genre_movie_list);
  const genres = data.genres;
  for (var i = 0; i < genres.length; i++) {
    if (
      genres[i].name == "Horror" ||
      genres[i].name == "Thriller" ||
      genres[i].name == "Western"
    ) {
      genres.splice(i, 1);
    }
  }

  GetGenres(genresList, genres, true);
}

async function getPopularMovies() {
  const { data, status } = await api.get(movie_popular_list, {
    language: "en-US",
  });
  popularMovies = data.results;
}

async function getTopRatedMovies() {
  const { data, status } = await api.get(movie_topRated_list, {
    language: "en-US",
  });
  topRated = data.results;
}

async function getMovieById(movieId) {
  const { data, status } = await api.get(`${movie}/${movieId}`, {
    language: "en-US",
  });
  fullMovie = data;
}

async function getWatchProviderByMovieId(movieId) {
  const { data, status } = await api.get(
    `${movie}/${movieId}${"/watch/providers"}`
  );
  watchProvider = data.results;
  watchProviderUS = watchProvider.US;
  watchProviderVE = watchProvider.VE;
}

async function getTrendingMovies() {
  const trendingMediaTypeSelected = trendingMediaTypes[1];
  const trendingTimeWindowSelected = trendingTimeWindow[0];
  const { data, status } = await api.get(
    `${trending}/${trendingMediaTypeSelected}/${trendingTimeWindowSelected}`
  );
  trendingMovies = data.results;

  for (var i = 0; i < trendingMovies.length; i++) {
    if (
      trendingMovies[i].adult ||
      trendingMovies[i].genre_ids.includes(27) ||
      trendingMovies[i].genre_ids.includes(53)
    ) {
      trendingMovies.splice(i, 1);
    }
  }
}

var previousGenre = "";
async function getMoviesBySearch(query) {
  const { data, status } = await api.get(searchMovie, {
    params: {
      query: query,
    },
  });
  searchMovieResults = data;
  console.log(searchMovieResults);
  console.log(searchMovieResults.results.length > 0);
  if (searchMovieResults.results.length > 0) {
    CreateMovieList(searchResults, searchMovieResults.results);
  } else {
    // no movies
  }

  // popularMovies = data.results;
  // for (var j = 0; j < popularMovies.length; j++) {
  //   if (!popularMovies[j].genre_ids.includes(genreId)) {
  //     popularMovies.splice(j, 1);
  //   }
  // }
  // popularMovies.forEach((movie) => {
  //   if (movie.adult && movie.genre_ids.includes(27)) return;
  //   movie.genre_ids.forEach((id) => {
  //     if (id == genreId) {
  //       i++;
  //       createMovieHTML(movie, popularMoviesByGenreList);
  //     }
  //   });
  // });
  // popularMoviesHelpText.classList.add("hidden");

  // if (i == 0) {
  //   showMessageWhenThereIsNotMovie(popularMoviesByGenreList);
  // }

  // previousGenre = genreName;
}

async function getTrendingMovies() {
  const trendingMediaTypeSelected = trendingMediaTypes[1];
  const trendingTimeWindowSelected = trendingTimeWindow[0];
  const { data, status } = await api.get(
    `${trending}/${trendingMediaTypeSelected}/${trendingTimeWindowSelected}`
  );
  trendingMovies = data.results;

  for (var i = 0; i < trendingMovies.length; i++) {
    if (
      trendingMovies[i].adult ||
      trendingMovies[i].genre_ids.includes(27) ||
      trendingMovies[i].genre_ids.includes(53)
    ) {
      trendingMovies.splice(i, 1);
    }
  }
}

function showMessageWhenThereIsNotMovie(NodeElement) {
  popularMoviesHelpText.classList.remove("hidden");

  const divNoMovies = document.createElement("div");
  divNoMovies.className = "italic text-center text-xl";
  divNoMovies.innerHTML = "There's no movies for this genre";

  NodeElement.innerHTML = "";
  NodeElement.className = "";
  NodeElement.append(divNoMovies);
}

async function showMovieDetail(movie) {
  if (movieSelected.dataset.movieId == movie.id) {
    if (!movieSelected.classList.contains("hidden")) {
      movieSelected.classList.add("hidden");
      body.classList.remove("overflow-hidden");
      return;
    }
  }

  await getMovieById(movie.id);

  movieSelected.dataset.movieId = movie.id;
  if (movieSelected.classList.contains("hidden")) {
    movieSelected.classList.remove("hidden");
  }

  body.classList.add("overflow-hidden");
  document.body.scrollTop = 0;
  smoothscroll();
  selectedMovieImg.setAttribute("src", getSrcForImage(movie.poster_path));
  selectedMovieImg.setAttribute("alt", fullMovie.title);

  selectedMovieTitle.innerHTML = fullMovie.title;
  selectedMovieOverview.innerHTML = movie.overview;
  selectedMovieReleaseDate.innerHTML = movie.release_date;
  selectedMoviePopularity.innerHTML = movie.popularity;

  selectedMovieGenres.innerHTML = "";
  GetGenres(selectedMovieGenres, fullMovie.genres, false);

  const watchProvider_FlatRate = document.getElementById(
    "watchProvider_FlatRate"
  );

  await getWatchProviderByMovieId(movie.id);

  if (!HaveProviders(watchProviderUS)) {
    watchProvider_FlatRate.classList.add("hidden");
    watchProviderRent.classList.add("hidden");
    return;
  }

  if (!HaveProviders_FlatRate(watchProviderUS)) {
    watchProvider_FlatRate.classList.add("hidden");
  } else {
    createProviderList(
      "watchProvider_FlatRate",
      "selectedMovie_FlatRateProvider",
      watchProviderUS.flatrate
    );
  }

  if (!HaveProviders_Rent(watchProviderUS.rent)) {
    watchProviderRent.classList.add("hidden");
  } else {
    createProviderList(
      "watchProvider_Rent",
      "selectedMovie_RentProvider",
      watchProviderUS.rent
    );
  }
}

function createProviderList(parentNode, childrenNode, providerList) {
  if (providerList != null) {
    const providerParent = document.getElementById(parentNode);
    providerParent.classList.remove("hidden");

    const providerChild = document.getElementById(childrenNode);
    providerChild.innerHTML = "";

    providerList.forEach((prov) => {
      providerChild.appendChild(createProviderImgHtml(prov));
    });
  }
}

function HaveProviders(Providers) {
  return Providers != null;
}

function HaveProviders_FlatRate(Providers) {
  return Providers != null;
}

function HaveProviders_Rent(Providers) {
  return Providers != null;
}

function createProviderImgHtml(model) {
  let name = model.provider_name;
  let srcPath = getSrcForImage(model.logo_path, 200);
  const img = document.createElement("img");
  img.className = "w-20";
  img.className = "max-w-[5rem]";
  img.setAttribute("src", srcPath);
  img.setAttribute("alt", name);
  return img;
}

async function showTrendingMovies() {
  trendingMovieList.innerHTML = "";

  await getTrendingMovies();
  trendingMovies.forEach((movie) => {
    if (movie.adult && movie.genre_ids.includes(27)) return;
    createMovieHTML(movie, trendingMovieList);
  });
}

function showTopRatedMoviesByUsers() {
  topRatedUsersList.innerHTML = "";

  topRated.forEach((movie) => {
    if (movie.adult && movie.genre_ids.includes(27)) return;
    createMovieHTML(movie, topRatedUsersList);
  });
}

function createMovieHTML(MovieObject, NodeElement) {
  const buttonForMovie = createMovieButton(MovieObject);
  buttonForMovie.appendChild(
    createPoster(MovieObject.original_title, MovieObject.poster_path)
  );
  buttonForMovie.appendChild(createMovieTitle(MovieObject.original_title));
  buttonForMovie.appendChild(lineBreakHtml());
  buttonForMovie.appendChild(createMovieStarsRate(MovieObject.vote_average));
  NodeElement.append(buttonForMovie);
}

function createMovieButton(movie) {
  const buttonForMovie = document.createElement("button");
  buttonForMovie.className = "scale-90 hover:scale-100 w-48 mx-auto";
  buttonForMovie.onclick = () => showMovieDetail(movie);
  return buttonForMovie;
}

function createPoster(movieTitle, moviePosterPath) {
  const imgMoviePoster = document.createElement("img");
  imgMoviePoster.className = "rounded-md poster";
  imgMoviePoster.setAttribute("src", getSrcForImage(moviePosterPath));
  imgMoviePoster.setAttribute("alt", movieTitle);
  return imgMoviePoster;
}

function createMovieTitle(movieTitle) {
  const spanMovieTitle = document.createElement("span");
  spanMovieTitle.className = "text-sm font-semibold h-40";
  spanMovieTitle.innerText = movieTitle;
  return spanMovieTitle;
}

function createMovieStarsRate(movieVoteAverage) {
  const spanVoteAverage = document.createElement("span");
  spanVoteAverage.className = "text-sm";
  spanVoteAverage.innerText = getStarsRate(movieVoteAverage);
  return spanVoteAverage;
}

function getStarsRate(voteAverage) {
  return "⭐ " + voteAverage.toFixed(1);
}

function lineBreakHtml() {
  return document.createElement("br");
}

async function errorMessage(response) {
  var vResult = true;
  if (response.status !== 200) {
    vResult = false;
    var emoji;
    emoji =
      response.status == 401 ? "🔐" : response.status == 500 ? "😞" : "😶";
    const textError = `${emoji} An error has ocurred: ${response.status} ${response.message}`;
    console.error(textError);
    spanError.innerText = textError;
    spanError.style.display = "block";
  }
  return vResult;
}

function getSrcForImage(path, paramWidth) {
  if (paramWidth == null) {
    paramWidth = 200;
  }
  return `${"https://image.tmdb.org/t/p/w"}${paramWidth}${path}`;
}

function closeMovieDetails() {
  const movieAsideWindows = document.getElementById("movieSelected");
  movieAsideWindows.classList.add("hidden");
  body.classList.remove("overflow-hidden");
}

function GetGenres(NodeElement, genres, IsPrincipalPage) {
  NodeElement.innerHTML = "";
  genres.forEach((genre) => {
    const buttonGenre = document.createElement("button");
    buttonGenre.className =
      "bg-gradient-to-r from-indigo-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 m-0.5 py-1 px-1.5 rounded";
    buttonGenre.innerHTML = genre.name;
    buttonGenre.dataset.genreName = genre.name;
    if (IsPrincipalPage) {
      buttonGenre.onclick = () => getPopularMoviesByGenre(genre.id, genre.name);
    }
    NodeElement.appendChild(buttonGenre);
  });
}

function smoothscroll() {
  const currentScroll =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(smoothscroll);
    window.scrollTo(0, currentScroll - currentScroll / 5);
  }
}

function CreateMovieList(NodeElement, movies) {
  NodeElement.innerHTML = "";
  movies.forEach((movie) => {
    if (movie.adult && movie.genre_ids.includes(27)) return;
    createMovieHTML(movie, NodeElement);
  });
}
