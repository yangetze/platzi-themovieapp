const token = config.TOKEN_AUTH_V4;
const key = config.API_KEY;
const UrlBase = "https://api.themoviedb.org/3";
const query_APIKey = '?api_key=' + key;

// feature
const genre = UrlBase + '/genre';

//method
const genre_movie_list = genre + "/movie/list";

const example = 'https://api.themoviedb.org/3/movie/550?api_key=' + key;
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
  const res = await fetch(genre_movie_list + query_APIKey)
  const data = await res.json();
  const genres = data.genres;

  genres.forEach(genre => {
    const divGenres = document.getElementById('genres');
    const div = document.createElement("div");
    div.className = 'relative w-8 h-8 scale-90 hover:scale-100 snap-center';
    
    const img = document.createElement('img');
    img.className = 'rounded-md';
    img.setAttribute("src", 'https://www.kindacode.com/wp-content/uploads/2022/06/big-boss.jpeg');
    
    const h3 = document.createElement('h3');
    h3.className = 'text-xl text-white font-bold';
    h3.innerText = genre.name;

    const p = document.createElement('p');
    p.className = 'mt-0 text-sm text-gray-300';
    p.innerText = genre.id;
   
    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(p);
    divGenres.append(div);
   
    // console.log(divGenres);
  });

  console.log("get_genres_movies_list");
  console.log(data); 
}

get_genres_movies_list();


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