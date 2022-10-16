searchBtn.addEventListener("click", () => {
  const txt = searchInput.value;
  if (typeof previousGenre === "string" && previousGenre.length === 0) {
    location.hash = "#search";
  } else {
    location.hash = "#search=" + txt;
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    const txt = searchInput.value;
    location.hash = "#search=" + txt;
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
    : location.hash.startsWith("#search=")
    ? searchPage()
    : location.hash.startsWith("#movie=")
    ? moviePage()
    : location.hash.startsWith("#topByUsers")
    ? topUsersPage()
    : homePage();

  smoothscroll();
}

async function homePage() {
  searchSection.classList.remove("hidden");
  trendingSection.classList.remove("hidden");
  topUsersSection.classList.add("hidden");
  genreSection.classList.add("hidden");
  popularMoviesByGenreSection.classList.add("hidden");
  await showTrendingMovies();
}

function trendsPage() {
  console.log("trends");
}

async function categoryPage() {
  await getGenres();
  genresList.innerHtml = "";
  searchSection.classList.add("hidden");
  trendingSection.classList.add("hidden");
  topUsersSection.classList.add("hidden");
  genreSection.classList.remove("hidden");
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
