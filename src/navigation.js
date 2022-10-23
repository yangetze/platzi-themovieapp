searchBtn.addEventListener("click", () => {
  const query = searchInput.value;
  if (typeof previousGenre === "string" && previousGenre.length === 0) {
    location.hash = "#search";
  } else {
    location.hash = "#search=" + query;
    getMoviesBySearch(query);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    const query = searchInput.value;
    location.hash = "#search=" + query;
    getMoviesBySearch(query);
    e.preventDefault();
  }
});

window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

function navigator() {
  console.log({ location }, ` ${location.hash}`);

  location.hash.startsWith("#trends")
    ? trendsPage()
    : location.hash.startsWith("#category")
    ? categoryPage()
    : location.hash.startsWith("#search")
    ? searchPage()
    : location.hash.startsWith("#movie")
    ? moviePage()
    : location.hash.startsWith("#topByUsers")
    ? topUsersPage()
    : homePage();

  smoothscroll();
}

async function homePage() {
  trendingSection.classList.remove("hidden");
  topUsersSection.classList.add("hidden");
  genreSection.classList.add("hidden");
  popularMoviesByGenreSection.classList.add("hidden");
  searchResults.classList.add("hidden");
  await showTrendingMovies();
}

function trendsPage() {
  console.log("trends");
}

async function categoryPage() {
  await getGenres();
  genresList.innerHtml = "";
  trendingSection.classList.add("hidden");
  topUsersSection.classList.add("hidden");
  genreSection.classList.remove("hidden");
  searchResults.classList.add("hidden");
}

function searchPage() {
  searchResults.classList.remove("hidden");
  trendingSection.classList.add("hidden");
  topUsersSection.classList.add("hidden");
  genreSection.classList.add("hidden");
  popularMoviesByGenreSection.classList.add("hidden");
}

async function topUsersPage() {
  await getTopRatedMovies();
  showTopRatedMoviesByUsers();

  searchResults.classList.add("hidden");
  trendingSection.classList.add("hidden");
  topUsersSection.classList.remove("hidden");
  genreSection.classList.add("hidden");
  popularMoviesByGenreSection.classList.add("hidden");
}

function moviePage() {
  console.log("moviePage");
}
