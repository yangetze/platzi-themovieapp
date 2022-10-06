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

const example = "https://api.themoviedb.org/3/movie/550?api_key=" + key;
const spanError = document.getElementById("error");

let popularMovies;
let fullMovie;
let trendingMovies;
let watchProvider;
let topRated;

const api = axios.create({
  baseURL: UrlBase,
  https: httpHeaders,
  params: {
    api_key: config.API_KEY,
  },
});

async function init() {
  await getGenres();
  await getPopularMovies();
  await getTrendingMovies();
  await getTopRatedMovies();
  showTrendingMovies();
  showTopRatedMoviesByUsers();
}

async function getGenres() {
  const { data, status } = await api.get(genre_movie_list);
  const genres = data.genres;

  genres.forEach((genre) => {
    if (genre.id == 27 || genre.id == 53) return;
    const divGenres = document.getElementById("genres");
    // const buttonForGenre = document.createElement("button");
    // buttonForGenre.className = "relative scale-90 hover:scale-100";
    // buttonForGenre.onclick = () =>
    //   getPopularMoviesByGenre(genre.id, genre.name);

    // const img = document.createElement("img");
    // img.className = "rounded-md";
    // img.setAttribute(
    //   "src",
    //   "https://www.kindacode.com/wp-content/uploads/2022/06/big-boss.jpeg"
    // );

    // const h3 = document.createElement("h3");
    // h3.className = "text-xl text-white font-bold";
    // h3.innerText = genre.name;

    // const divAbsolute = document.createElement("div");
    // divAbsolute.className = "absolute bottom-0 left-0 right-0 px-3 py-1";
    // divAbsolute.appendChild(h3);

    // buttonForGenre.appendChild(img);
    // buttonForGenre.appendChild(divAbsolute);
    // divGenres.append(buttonForGenre);

    const buttonGenre = document.createElement("button");
    buttonGenre.className =
      "bg-gradient-to-r from-indigo-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 m-0.5";
    buttonGenre.innerHTML = genre.name;
    buttonGenre.onclick = () => getPopularMoviesByGenre(genre.id, genre.name);
    divGenres.append(buttonGenre);
  });
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
}

async function getPopularMoviesByGenre(genreId, genreName) {
  const NodeName = "popularMoviesByGenre";
  const title = document.getElementById("popularMoviesTitle");
  title.innerHTML = "Popular Movies by " + genreName;
  const divPopularMoviesByGenre = document.getElementById(NodeName);
  divPopularMoviesByGenre.innerHTML = "";
  divPopularMoviesByGenre.className = "grid grid-cols-4 gap-4";
  var i = 0;
  popularMovies.forEach((movie) => {
    if (movie.adult && movie.genre_ids.includes(27)) return;
    movie.genre_ids.forEach((id) => {
      if (id == genreId) {
        i++;
        createMovieHTML(movie, NodeName);
      }
    });
  });

  if (i == 0) {
    showMessageWhenThereIsNotMovie(NodeName);
  }
}

function showMessageWhenThereIsNotMovie(elementId) {
  const divNoMovies = document.createElement("div");
  divNoMovies.className = "italic text-center text-xl";
  divNoMovies.innerHTML = "There's no movies for this genre";

  const elementBase = document.getElementById(elementId);
  elementBase.innerHTML = "";
  elementBase.className = "";
  elementBase.append(divNoMovies);
}

async function showMovieDetail(movie) {
  const movieAsideWindows = document.getElementById("movieSelected");
  if (movieAsideWindows.dataset.movieId == movie.id) {
    if (!movieAsideWindows.classList.contains("hidden")) {
      movieAsideWindows.classList.add("hidden");
      return;
    }
  }

  await getMovieById(movie.id);

  movieAsideWindows.dataset.movieId = movie.id;
  movieAsideWindows.classList.remove("hidden");
  const moviePoster = document.getElementById("selectedMovie_img");
  moviePoster.setAttribute("src", getSrcForImage(movie.poster_path));
  moviePoster.setAttribute("alt", fullMovie.title);

  const movieTitle = document.getElementById("selectedMovie_title");
  movieTitle.innerHTML = fullMovie.title;
  movieTitle.className =
    "text-[22px] text-gray-900 font-extrabold leading-snug text-center";

  const movieOverview = document.getElementById("selectedMovie_overview");
  movieOverview.innerHTML = movie.overview;

  const movieReleaseDate = document.getElementById("selectedMovie_releaseDate");
  movieReleaseDate.innerHTML = movie.release_date;

  const moviePopularity = document.getElementById("selectedMovie_popularity");
  moviePopularity.innerHTML = movie.popularity;

  const movieGenres = document.getElementById("selectedMovie_genres");
  let genres = "";
  let i = 0;

  fullMovie.genres.forEach((genre) => {
    genres += (i >= 1 ? SeparatorComma : "") + genre.name;
    i++;
  });
  movieGenres.innerHTML = genres;

  const watchProvider_FlatRate = document.getElementById(
    "watchProvider_FlatRate"
  );
  const watchProvider_Rent = document.getElementById("watchProvider_Rent");

  await getWatchProviderByMovieId(movie.id);

  if (!HaveProviders(watchProviderUS)) {
    watchProvider_FlatRate.classList.add("hidden");
    watchProvider_Rent.classList.add("hidden");
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

  if (!HaveProviders_Rent(watchProviderUS)) {
    watchProvider_Rent.classList.add("hidden");
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

function showTrendingMovies() {
  const NodeName = "trendingMoviesByGenre";
  const trendingMoviesDiv = document.getElementById(NodeName);
  trendingMoviesDiv.innerHTML = "";

  trendingMovies.forEach((movie) => {
    if (movie.adult && movie.genre_ids.includes(27)) return;
    createMovieHTML(movie, NodeName);
  });
}

function showTopRatedMoviesByUsers() {
  const NodeName = "topRatedUsers";
  topRated.forEach((movie) => {
    if (movie.adult && movie.genre_ids.includes(27)) return;
    createMovieHTML(movie, NodeName);
  });
}

function createMovieHTML(MovieObject, elementId) {
  const elementBase = document.getElementById(elementId);
  const buttonForMovie = createMovieButton(MovieObject);
  buttonForMovie.appendChild(
    createPoster(MovieObject.original_title, MovieObject.poster_path)
  );
  buttonForMovie.appendChild(createMovieTitle(MovieObject.original_title));
  buttonForMovie.appendChild(lineBreakHtml());
  buttonForMovie.appendChild(createMovieStarsRate(MovieObject.vote_average));
  elementBase.append(buttonForMovie);
}

function createMovieButton(movie) {
  const buttonForMovie = document.createElement("button");
  buttonForMovie.className = "text-center scale-90 hover:scale-100 w-48";
  buttonForMovie.onclick = () => showMovieDetail(movie);
  return buttonForMovie;
}

function createPoster(movieTitle, moviePosterPath) {
  const imgMoviePoster = document.createElement("img");
  imgMoviePoster.className = "rounded-md poster mx-auto my-0 ";
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
