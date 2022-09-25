const token = config.TOKEN_AUTH_V4;
const key = config.API_KEY;
const UrlBase = "https://api.themoviedb.org/3";
const query_APIKey = "?api_key=" + key;

// feature
const genre = UrlBase + "/genre";
const movie = UrlBase + "/movie";

//method
const genre_movie_list = `${genre}/movie/list`;

const movie_popular_list = `${movie}/popular`;

const example = "https://api.themoviedb.org/3/movie/550?api_key=" + key;
const spanError = document.getElementById("error");

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

async function get_genres_movies_list() {
  const res = await fetch(genre_movie_list + query_APIKey);
  const data = await res.json();
  const genres = data.genres;

  genres.forEach((genre) => {
    if (genre.id == 27) return;
    const divGenres = document.getElementById("genres");
    const div = document.createElement("div");
    div.className = "relative scale-90 hover:scale-100";

    const img = document.createElement("img");
    img.className = "rounded-md";
    img.setAttribute(
      "src",
      "https://www.kindacode.com/wp-content/uploads/2022/06/big-boss.jpeg"
    );
    // img.setAttribute("width", '200px');
    // img.setAttribute("height", '200px');

    const h3 = document.createElement("h3");
    h3.className = "text-xl text-white font-bold";
    h3.innerText = genre.name;

    const p = document.createElement("p");
    p.className = "mt-0 text-sm text-gray-300";
    p.innerText = genre.id;

    const divAbsolute = document.createElement("div");
    divAbsolute.className = "absolute bottom-0 left-0 right-0 px-3 py-1";
    divAbsolute.appendChild(h3);
    divAbsolute.appendChild(p);

    div.appendChild(img);
    div.appendChild(divAbsolute);
    divGenres.append(div);
  });

  // console.log("get_genres_movies_list");
  // console.log(data);
}

async function getPopularMovies() {
  const res = await fetch(
    movie_popular_list + query_APIKey + "&language=en-US"
  );
  const data = await res.json();
  const movies = data.results;
  // console.log(movies);
  // var xy = movies.filter(function(element){
  //   element.adult == false,
  //   element.genre_ids != 27
  // });
  // console.log(xy)

  movies.forEach((movie) => {
    if (movie.adult && movie.genre_ids == 27) return;
    const divPopularMoviesByGenre = document.getElementById(
      "popularMoviesByGenre"
    );

    const div = document.createElement("div");
    div.className =
      "flex-2 m-1 rounded-md border bg-indigo-500 text-center scale-95 hover:scale-100";

    const img = document.createElement("img");
    img.className = "rounded-md poster mx-auto my-0";
    img.setAttribute("src", getSrcForImage(movie.backdrop_path));

    const span = document.createElement("span");
    span.className = "text-sm";
    span.innerText = movie.original_title;

    div.appendChild(img);
    div.appendChild(span);
    divPopularMoviesByGenre.append(div);
  });
}

get_genres_movies_list();
getPopularMovies();

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
  return "https://image.tmdb.org/t/p/original" + path;
}
