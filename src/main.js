const token = config.TOKEN_AUTH_V4;
const key = config.API_KEY;
const UrlBase = "https://api.themoviedb.org/3";
const query_APIKey = "?api_key=" + key;
const SeparatorComma = ", ";

// feature
const genre = UrlBase + "/genre";
const movie = UrlBase + "/movie";
const trending = UrlBase + "/trending";

//method
const genre_movie_list = `${genre}/movie/list`;

const movie_popular_list = `${movie}/popular`;

const example = "https://api.themoviedb.org/3/movie/550?api_key=" + key;
const spanError = document.getElementById("error");

let popularMovies;
let fullMovie;
let trendingMovies;

const instance = axios.create({
  baseURL: UrlBase,
  headers: {
    "X-API-KEY": key,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain",
    },
  },
});

async function init() {
  await getGenres();
  await getPopularMovies();
  await getTrendingMovies();
  showTrendingMovies();
}

async function getGenres() {
  const res = await fetch(genre_movie_list + query_APIKey);
  const data = await res.json();
  const genres = data.genres;

  genres.forEach((genre) => {
    if (genre.id == 27 || genre.id == 53) return;
    const divGenres = document.getElementById("genres");
    const buttonForGenre = document.createElement("button");
    buttonForGenre.className = "relative scale-90 hover:scale-100";
    buttonForGenre.onclick = () =>
      getPopularMoviesByGenre(genre.id, genre.name);

    const img = document.createElement("img");
    img.className = "rounded-md";
    img.setAttribute(
      "src",
      "https://www.kindacode.com/wp-content/uploads/2022/06/big-boss.jpeg"
    );

    const h3 = document.createElement("h3");
    h3.className = "text-xl text-white font-bold";
    h3.innerText = genre.name;

    const divAbsolute = document.createElement("div");
    divAbsolute.className = "absolute bottom-0 left-0 right-0 px-3 py-1";
    divAbsolute.appendChild(h3);

    buttonForGenre.appendChild(img);
    buttonForGenre.appendChild(divAbsolute);
    divGenres.append(buttonForGenre);
  });
}

async function getPopularMovies() {
  const res = await fetch(
    movie_popular_list + query_APIKey + "&language=en-US"
  );
  const data = await res.json();
  popularMovies = data.results;
}

async function getMovieById(movieId) {
  const res = await fetch(
    `${movie}/${movieId}${query_APIKey}${"&language=en-US"}`
  );
  const data = await res.json();
  fullMovie = data;
}

async function getTrendingMovies() {
  const res = await fetch(`${trending}/${"movie/"}${"day"}${query_APIKey}`);
  const data = await res.json();
  trendingMovies = data.results;
}

async function getPopularMoviesByGenre(genreId, genreName) {
  const title = document.getElementById("popularMoviesTitle");
  title.innerHTML = "Popular Movies by " + genreName;
  const divPopularMoviesByGenre = document.getElementById(
    "popularMoviesByGenre"
  );
  divPopularMoviesByGenre.innerHTML = "";
  divPopularMoviesByGenre.className = "grid grid-cols-4 gap-4";
  var i = 0;
  popularMovies.forEach((movie) => {
    if (movie.adult && movie.genre_ids.includes(27)) return;
    movie.genre_ids.forEach((id) => {
      if (id == genreId) {
        i++;
        const buttonForMovie = document.createElement("button");
        buttonForMovie.className = "text-center scale-90 hover:scale-100";
        buttonForMovie.onclick = () => showSelectedMovie(movie);

        const imgMoviePoster = document.createElement("img");
        imgMoviePoster.className = "rounded-md poster mx-auto my-0 ";
        imgMoviePoster.setAttribute("src", getSrcForImage(movie.poster_path));
        imgMoviePoster.setAttribute("alt", movie.original_title);

        const spanMovieTitle = document.createElement("span");
        spanMovieTitle.className = "text-sm font-semibold";
        spanMovieTitle.innerText = movie.original_title;

        const spanVoteAverage = document.createElement("span");
        spanVoteAverage.className = "text-sm";

        const vote = Number.parseInt(movie.vote_average);
        let stars = "";
        for (var x = 0; x < vote; x++) {
          stars += "★";
        }
        for (var x = 0; x < 10 - vote; x++) {
          stars += "☆";
        }
        const voteFixed = movie.vote_average.toFixed(2)
        spanVoteAverage.innerText = stars + " " +  voteFixed;
        const br = document.createElement("br");

        buttonForMovie.appendChild(imgMoviePoster);
        buttonForMovie.appendChild(spanMovieTitle);
        buttonForMovie.appendChild(br);
        buttonForMovie.appendChild(spanVoteAverage);
        divPopularMoviesByGenre.append(buttonForMovie);
      }
    });
  });

  if (i == 0) {
    const divNoMovies = document.createElement("div");
    divNoMovies.className = "italic text-center text-xl";
    divNoMovies.innerHTML = "There's no movies for this genre";
    divPopularMoviesByGenre.append(divNoMovies);
    divPopularMoviesByGenre.className = "";
  }
}

async function showSelectedMovie(movie) {
  const movieAsideWindows = document.getElementById("movieSelected");
  if (movieAsideWindows.dataset.movieId == movie.id) {
    movieAsideWindows.classList.add("hidden");
    return;
  }

  await getMovieById(movie.id);

  movieAsideWindows.dataset.movieId = movie.id;
  movieAsideWindows.classList.remove("hidden");
  const moviePoster = document.getElementById("selectedMovie_img");
  moviePoster.setAttribute("src", getSrcForImage(movie.poster_path));
  moviePoster.setAttribute("alt", fullMovie.title);

  const movieTitle = document.getElementById("selectedMovie_title");
  movieTitle.innerHTML = fullMovie.title;
  movieTitle.className = 'h-40'

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
}

function showTrendingMovies() {
  const trendingMoviesDiv = document.getElementById("trendingMoviesByGenre");
  trendingMoviesDiv.innerHTML = "";

  trendingMovies.forEach((movie) => {
    if (movie.adult && movie.genre_ids.includes(27)) return;
    const buttonForMovie = document.createElement("button");
    buttonForMovie.className = "text-center scale-90 hover:scale-100";
    buttonForMovie.onclick = () => showSelectedMovie(movie);

    const imgMoviePoster = document.createElement("img");
    imgMoviePoster.className = "rounded-md poster mx-auto my-0 ";
    imgMoviePoster.setAttribute("src", getSrcForImage(movie.poster_path));
    imgMoviePoster.setAttribute("alt", movie.original_title);

    const spanMovieTitle = document.createElement("span");
    spanMovieTitle.className = "text-sm font-semibold h-40";
    spanMovieTitle.innerText = movie.original_title;

    const spanVoteAverage = document.createElement("span");
    spanVoteAverage.className = "text-sm";

    const vote = Number.parseInt(movie.vote_average);
    let stars = "";
    for (var x = 0; x < vote; x++) {
      stars += "★";
    }
    for (var x = 0; x < 10 - vote; x++) {
      stars += "☆";
    }
    spanVoteAverage.innerText = stars + " " + movie.vote_average;
    const br = document.createElement("br");

    buttonForMovie.appendChild(imgMoviePoster);
    buttonForMovie.appendChild(spanMovieTitle);
    buttonForMovie.appendChild(br);
    buttonForMovie.appendChild(spanVoteAverage);
    trendingMoviesDiv.append(buttonForMovie);
  });
}

init();

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

function getSrcForImage(path) {
  return "https://image.tmdb.org/t/p/w200" + path;
}

// 27 HORROR, 53 Thriller
