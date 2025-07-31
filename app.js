const API_KEY = "2e3d4fd2"; // Replace with your OMDb API key

const defaultMovies = ["Inception", "Interstellar", "The Dark Knight", "Avengers", "Titanic"];

const movieList = document.getElementById("movie-list");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-btn");
const loader = document.getElementById("loader");

const modal = document.getElementById("movie-modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close") || document.querySelector(".close");

// Show loader
function showLoader() {
  loader.classList.remove("hidden");
}

// Hide loader
function hideLoader() {
  loader.classList.add("hidden");
}

// Show clear button if input has value
function toggleClearButton() {
  if (searchInput.value.trim()) {
    clearBtn.style.display = "inline-block";
  } else {
    clearBtn.style.display = "none";
  }
}

// Load default movies on start
window.addEventListener("DOMContentLoaded", () => {
  movieList.innerHTML = "";
  defaultMovies.forEach(title => fetchAndDisplayMovies(title, false));
});

// Search button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;

  movieList.innerHTML = "";
  fetchAndDisplayMovies(query, true);
});

// Clear search input
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.style.display = "none";
  movieList.innerHTML = "";
  defaultMovies.forEach(title => fetchAndDisplayMovies(title, false));
});

// Show clear button on typing
searchInput.addEventListener("input", toggleClearButton);

// Fetch and display movies list
function fetchAndDisplayMovies(query, clear = false) {
  showLoader();

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      hideLoader();

      if (clear) movieList.innerHTML = "";

      if (data.Response === "True") {
        data.Search.forEach(movie => {
          const movieCard = document.createElement("div");
          movieCard.classList.add("movie-card");
          movieCard.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150x220?text=No+Image"}" alt="${movie.Title}" />
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
          `;
          movieCard.addEventListener("click", () => showMovieDetails(movie.imdbID));
          movieList.appendChild(movieCard);
        });
      } else {
        if (clear) {
          movieList.innerHTML = `<p style="text-align:center; color:#ffaaaa; font-weight:bold;">No movies found for "<strong>${query}</strong>".</p>`;
        }
      }
    })
    .catch(err => {
      hideLoader();
      console.error("Fetch error:", err);
      movieList.innerHTML = `<p style="color:red; text-align:center;">Error fetching movies. Try again later.</p>`;
    });
}

// Fetch and show detailed movie info in modal
function showMovieDetails(imdbID) {
  showLoader();

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`)
    .then(res => res.json())
    .then(movie => {
      hideLoader();

      if (movie.Response === "True") {
        modalBody.innerHTML = `
          <h2>${movie.Title} (${movie.Year})</h2>
          <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x400?text=No+Image"}" alt="${movie.Title}" style="width:100%; max-width:300px; border-radius:12px; margin-bottom:1rem;" />
          <p><strong>Genre:</strong> ${movie.Genre}</p>
          <p><strong>Director:</strong> ${movie.Director}</p>
          <p><strong>Actors:</strong> ${movie.Actors}</p>
          <p><strong>Plot:</strong> ${movie.Plot}</p>
          <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
          <p><strong>Runtime:</strong> ${movie.Runtime}</p>
          <p><strong>Language:</strong> ${movie.Language}</p>
        `;
        modal.classList.remove("hidden");
      } else {
        alert("Movie details not found.");
      }
    })
    .catch(err => {
      hideLoader();
      alert("Error fetching movie details.");
      console.error(err);
    });
}

// Close modal
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Close modal on outside click
window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
