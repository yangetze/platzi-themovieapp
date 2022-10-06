window.addEventListener("DOMContentLoaded", navigator, false)
window.addEventListener("hashchange", navigator, false)

function navigator() {
  console.log({ location });

  if (location.hash.startsWith("#trends")) {
    trendsPage();
  } else if (location.hash.startsWith("#category")) {
    categoryPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();
  } else {
    homePage();
  }
}

function homePage() {
  init();
}

function trendsPage() {
  console.log("trends");
}

function categoryPage() {
  console.log("categories");
}

function searchPage() {
  console.log("search");
}

function otherPage() {
  console.log("other");
}
