require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();
const port = 3000;

// Set up Handlebars as the view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Register partials
hbs.registerPartials(path.join(__dirname, "views/partials"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
  res.render("index", {
    title: "CorpTechs Similar Movie Finder",
    message: "Type a movie and we'll give you one just like it!!",
  });
});

// API route for fetching similar movies
app.get("/movies/similar", async (req, res) => {
  const axios = require("axios");
  const API_KEY = process.env.TMDB_API_KEY; // Replace with your TMDB API key
  const port = process.env.PORT || 3000;
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";

  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ error: "Must Provide a movie title" });
  }

  try {
    // Step 1: Search for the movie
    const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: API_KEY, query: title },
    });

    if (
      !searchResponse.data.results ||
      searchResponse.data.results.length === 0
    ) {
      return res.status(404).json({ error: "Movie not found." });
    }

    const movieId = searchResponse.data.results[0].id;

    // Step 2: Fetch similar movies
    const similarMoviesResponse = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/similar`,
      {
        params: { api_key: API_KEY },
      }
    );

    res.json(similarMoviesResponse.data.results);
  } catch (error) {
    console.error(
      "Error fetching similar movies:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "There was an error searching for similar movies" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
