async function fetchOMDBData(searchTerm, apiKey) {
  const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(searchTerm)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during data fetch:", error);
    throw error; // Propagate the error up to the caller
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("locationInput");
  const resultsContainer = document.getElementById("results");

  searchInput.addEventListener("input", async function () {
    const movieSearch = searchInput.value.trim();

    if (!movieSearch) {
      // Clear results if the input is empty
      resultsContainer.innerHTML = "";
      return;
    }

    const apiKey = "ebba7249";

    try {
      const data = await fetchOMDBData(movieSearch, apiKey);
      displayResults(data);
    } catch (error) {
      console.error("Failed to get data:", error);
    }
  });

  function displayResults(data) {
    // Clear previous results
    resultsContainer.innerHTML = "";

    if (data.Title) {
      const card = document.createElement("div");
      card.innerHTML = `
        <div class="wrapper">
          <div class="main_card">
            <div class="card_left">
              <div class="card_details">
                <h1>${data.Title}</h1>
                <div class="card_cat">
                  <p class="PG">${data.Rated}</p>
                  <p class="year">${data.Year}</p>
                  <p class="genre">${data.Genre} </p>
                  <p class="time">${data.Runtime}</p>
                </div>
                <p class="disc">${data.Plot}</p>
                <a href="https://www.imdb.com/title/${
                  data.imdbID
                }/" target="_blank">Read More</a>
                <div class="director-actors">
                  <p><strong>Directed by:</strong> ${data.Director}</p>
                  <p><strong>Written by:</strong> ${data.Writer}</p>
                  <p><strong>Actors:</strong> ${data.Actors}</p>
                </div>
                <div class="social-btn">
                  <!-- USERS RATINGS -->
                  ${data.Ratings.map(
                    (rating) => `
                    <button>
                      <img src="${getLogoUrl(rating.Source)}" alt="${
                      rating.Source
                    } Logo" style="width: 30px; height: 30px;"> ${rating.Value}
                    </button>
                  `
                  ).join("")}
                  <!-- BOOKMARK -->
                  <button class="heart-button">
                    <i class="bi-heart-fill"></i>
                  </button>
                  <!-- EYE BUTTON -->
                  <button class="watch-button">
                    <i class="bi bi-eye-fill"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="card_right">
              <div class="img_container">
                <img src="${data.Poster}" alt="">
              </div>
              <div class="play_btn">
                <a href="https://www.imdb.com/title/${
                  data.imdbID
                }/" target="_blank">
                  <i class="fas fa-play-circle"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;

      resultsContainer.appendChild(card);

      // Add event listener to toggle heart icon and add to favorites
      const heartIcon = card.querySelector(".bi-heart-fill");
      heartIcon.addEventListener("click", function () {
        heartIcon.classList.toggle("red");
        const isFilled = heartIcon.classList.contains("red");
        if (isFilled) {
          addToFavorites(data.Title, data.Genre, data.Poster, data.imdbID);
        } else {
          // Remove from favorites
        }
      });

      // Add event listener to toggle watch icon and add to watchlist
      const watchIcon = card.querySelector(".bi.bi-eye-fill");
      watchIcon.addEventListener("click", function () {
        watchIcon.classList.toggle("red");
        const isWatched = watchIcon.classList.contains("red");
        if (isWatched) {
          addToWatchlist(data.Title, data.Genre, data.Poster, data.imdbID);
        } else {
          removeFromWatchlist(data.imdbID);
        }
      });

      // Check if movie exists in watchlist and update display
      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      const isWatched = watchlist.some((movie) => movie.imdbID === data.imdbID);
      if (isWatched) {
        watchIcon.classList.add("red");
      }
    } else {
      // No movie found
      resultsContainer.innerHTML = "<p>No movie found.</p>";
    }
  }
});

function addToWatchlist(title, genre, poster, imdbID) {
  const movie = {
    title,
    genre,
    poster,
    imdbID,
    addedDate: new Date().toISOString(),
  };
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist.push(movie);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

// Function to remove movie from watchlist
function removeFromWatchlist(imdbID) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist = watchlist.filter((movie) => movie.imdbID !== imdbID);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

// Optionally, check if movie is already in watchlist and update display

function addToFavorites(title, genre, poster, imdbID) {
  const movie = {
    title: title,
    genre: genre,
    poster: poster,
    imdbID: imdbID,
  };

  // Retrieve favorites from local storage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  // Retrieve comedy favorites from local storage
  let comedyFavorites =
    JSON.parse(localStorage.getItem("comedyFavorites")) || [];

  let actionFavorites =
    JSON.parse(localStorage.getItem("actionFavorites")) || [];

  let dramaFavorites = JSON.parse(localStorage.getItem("dramaFavorites")) || [];

  let horrorFavorites =
    JSON.parse(localStorage.getItem("horrorFavorites")) || [];

  // Check if the movie is already in favorites
  const isAlreadyInFavorites = favorites.some(
    (fav) => fav.title === movie.title
  );
  // Check if the movie is already in comedy favorites
  const isAlreadyInComedyFavorites = comedyFavorites.some(
    (fav) => fav.title === movie.title
  );

  const isAlreadyInActionFavorites = actionFavorites.some(
    (fav) => fav.title === movie.title
  );

  const isAlreadyInDramaFavorites = dramaFavorites.some(
    (fav) => fav.title === movie.title
  );

  const isAlreadyInHorrorFavorites = horrorFavorites.some(
    (fav) => fav.title === movie.title
  );

  if (!isAlreadyInFavorites) {
    // Add the movie to general favorites
    favorites.push(movie);
    // Save updated favorites array to local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  // If the genre is comedy and the movie is not already in comedy favorites
  if (genre.toLowerCase().includes("comedy") && !isAlreadyInComedyFavorites) {
    // Add the movie to comedy favorites
    comedyFavorites.push(movie);
    // Save updated comedy favorites array to local storage
    localStorage.setItem("comedyFavorites", JSON.stringify(comedyFavorites));
  }

  if (genre.toLowerCase().includes("action") && !isAlreadyInActionFavorites) {
    // Add the movie to comedy favorites
    actionFavorites.push(movie);
    // Save updated comedy favorites array to local storage
    localStorage.setItem("actionFavorites", JSON.stringify(actionFavorites));
  }

  if (genre.toLowerCase().includes("drama") && !isAlreadyInDramaFavorites) {
    // Add the movie to comedy favorites
    dramaFavorites.push(movie);
    // Save updated comedy favorites array to local storage
    localStorage.setItem("dramaFavorites", JSON.stringify(dramaFavorites));
  }

  if (genre.toLowerCase().includes("horror") && !isAlreadyInHorrorFavorites) {
    // Add the movie to comedy favorites
    horrorFavorites.push(movie);
    // Save updated comedy favorites array to local storage
    localStorage.setItem("horrorFavorites", JSON.stringify(horrorFavorites));
  }
}

function addToComedyFavorites(title, genre, poster, imdbID) {
  const comedyFavorites =
    JSON.parse(localStorage.getItem("comedyFavorites")) || [];
  const movie = {
    title: title,
    genre: genre,
    poster: poster,
    imdbID: imdbID,
  };

  // Add the movie to comedy favorites
  comedyFavorites.push(movie);

  // Save updated comedy favorites array to local storage
  localStorage.setItem("comedyFavorites", JSON.stringify(comedyFavorites));
}

function addToActionFavorites(title, genre, poster, imdbID) {
  const actionFavorites =
    JSON.parse(localStorage.getItem("actionFavorites")) || [];
  const movie = {
    title: title,
    genre: genre,
    poster: poster,
    imdbID: imdbID,
  };

  // Add the movie to comedy favorites
  actionFavorites.push(movie);

  // Save updated comedy favorites array to local storage
  localStorage.setItem("actionFavorites", JSON.stringify(actionFavorites));
}

function addToDramaFavorites(title, genre, poster, imdbID) {
  const dramaFavorites =
    JSON.parse(localStorage.getItem("dramaFavorites")) || [];
  const movie = {
    title: title,
    genre: genre,
    poster: poster,
    imdbID: imdbID,
  };

  // Add the movie to comedy favorites
  dramaFavorites.push(movie);

  // Save updated comedy favorites array to local storage
  localStorage.setItem("dramaFavorites", JSON.stringify(dramaFavorites));
}

function addToHorrorFavorites(title, genre, poster, imdbID) {
  const horrorFavorites =
    JSON.parse(localStorage.getItem("horrorFavorites")) || [];
  const movie = {
    title: title,
    genre: genre,
    poster: poster,
    imdbID: imdbID,
  };

  // Add the movie to comedy favorites
  horrorFavorites.push(movie);

  // Save updated comedy favorites array to local storage
  localStorage.setItem("horrorFavorites", JSON.stringify(horrorFavorites));
}

function getLogoUrl(source) {
  switch (source) {
    case "Internet Movie Database":
      return "https://iconape.com/wp-content/png_logo_vector/imdb-2.png";
    case "Rotten Tomatoes":
      return "https://vignette2.wikia.nocookie.net/logopedia/images/9/9c/Rotten_Tomatoes_2.svg/revision/latest?cb=20160706062736";
    case "Metacritic":
      return "https://www.pinclipart.com/picdir/big/149-1497095_file-metacritic-svg-wikimedia-commons-gucci-logo-svg.png";
    default:
      return ""; // Return empty string for unknown sources
  }
}
