window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

function navigator() {
  console.log({ location },` ${location.hash}`);

  location.hash.startsWith("#trends")
    ? trendsPage()
    : location.hash.startsWith("#category")
    ? categoryPage()
    : location.hash.startsWith("#search=")
    ? searchPage()
    : location.hash.startsWith("#movie=")
    ? moviePage()
    : location.hash.startsWith("#category=")
    ? categoryPage()
    : location.hash.startsWith("#topByUsers")
    ? topUsersPage()
    : homePage();
}

async function homePage() {
  searchSection.classList.remove("hidden");
  trendingSection.classList.remove("hidden");
  topUsersSection.classList.add("hidden");
  genreSection.classList.add("hidden");
  popularMoviesByGenreSection.classList.add("hidden");
  
  await getTrendingMovies();
  showTrendingMovies();
}

function trendsPage() {
  console.log("trends");
}

async function categoryPage() {
  await getGenres();
  await getPopularMovies();

  searchSection.classList.add("hidden");
  trendingSection.classList.add("hidden");
  topUsersSection.classList.add("hidden");
  genreSection.classList.remove("hidden");
  popularMoviesByGenreSection.classList.add("hidden");
}

function searchPage() {
  console.log("search");
}

async function topUsersPage() {
  await getTopRatedMovies();
  showTopRatedMoviesByUsers();

  searchSection.classList.add("hidden");
  trendingSection.classList.add("hidden");
  topUsersSection.classList.remove("hidden");
  genreSection.classList.add("hidden");
  popularMoviesByGenreSection.classList.add("hidden");
}

function moviePage() {
  console.log("moviePage");
}
