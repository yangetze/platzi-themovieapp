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

async function getGenres() {
  const res = await fetch(genre_movie_list + query_APIKey);
  const data = await res.json();
  const genres = data.genres;

  genres.forEach((genre) => {
    if (genre.id == 27 || genre.id == 53) return;
    const divGenres = document.getElementById("genres");
    const buttonForGenre = document.createElement("button");
    buttonForGenre.className = "relative scale-90 hover:scale-100";
    buttonForGenre.onclick = () => getPopularMoviesByGenre(genre.id);

    const img = document.createElement("img");
    img.className = "rounded-md";
    img.setAttribute(
      "src",
      "https://www.kindacode.com/wp-content/uploads/2022/06/big-boss.jpeg"
    );

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

    buttonForGenre.appendChild(img);
    buttonForGenre.appendChild(divAbsolute);
    divGenres.append(buttonForGenre);
  });
}

async function getPopularMoviesByGenre(genreId) {
  const res = await fetch(
    movie_popular_list + query_APIKey + "&language=en-US"
  );
  const data = await res.json();
  const movies = data.results;
  console.log(movies);
  const divPopularMoviesByGenre = document.getElementById(
    "popularMoviesByGenre"
  );
  divPopularMoviesByGenre.innerHTML = "";
  var i  = 0;
  movies.forEach((movie) => {
    if (movie.adult && movie.genre_ids.includes(27)) return;
    // || movie.genre_ids.includes(53)
    movie.genre_ids.forEach((id) => {
      if (id == genreId) {
        i++;
        const buttonForGenre = document.createElement("button");
        buttonForGenre.className = "text-center scale-90 hover:scale-100";

        const imgMoviePoster = document.createElement("img");
        imgMoviePoster.className = "rounded-md poster mx-auto my-0 ";
        imgMoviePoster.setAttribute("src", getSrcForImage(movie.poster_path));
        imgMoviePoster.setAttribute("alt", movie.original_title);

        const spanMovieTitle = document.createElement("span");
        spanMovieTitle.className = "text-sm font-semibold";
        spanMovieTitle.innerText = movie.original_title;

        const spanVoteAverage = document.createElement("span");
        spanVoteAverage.className = "text-sm";
        spanVoteAverage.innerText = movie.vote_average;

        const br = document.createElement("br");

        buttonForGenre.appendChild(imgMoviePoster);
        buttonForGenre.appendChild(spanMovieTitle);
        buttonForGenre.appendChild(br);
        buttonForGenre.appendChild(spanVoteAverage);
        divPopularMoviesByGenre.append(buttonForGenre);
      }
    });
    
  });

  if(i == 0){
    const spanNoMovies = document.createElement('span');
    spanNoMovies.className = 'italic center'
    spanNoMovies.innerHTML = "There's no movies for this genre"
    divPopularMoviesByGenre.append(spanNoMovies);
  }
}

getGenres();

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
  return "https://image.tmdb.org/t/p/w300" + path;
}

// 27 HORROR, 53 Thriller
