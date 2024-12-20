// This loads enviorment variables from a .env file into process.env. Its used to keep sensitive information like API keys out of my source code.
require("dotenv").config();
// This imports the express library. The express library is used to create a web server
const express = require("express");
// This line imports the built in path module. This helps with handling file and direcvtory paths.
const path = require("path");
const hbs = require("hbs");
// Creates an express application instance to handle HTTP request and responses
const app = express();
const port = 3000;

// This line configures Handlebars as the template engine for rendering dynamic HTML files.
app.set("view engine", "hbs");
// This line specifies the folder views where my handlebars templates are stored.
app.set("views", path.join(__dirname, "views"));

// Register partials
hbs.registerPartials(path.join(__dirname, "views/partials"));

// Serves static files like my CSS and JS from my public folder.
app.use(express.static(path.join(__dirname, "public")));

// This line handles the root route which is /
// res.render renders the index.hbs file and passes dynamic data.
app.get("/", (req, res) => {
  res.render("index", {
    title: "CorpTechs Similar Movie Finder",
    message: "Type a movie and we'll give you one just like it!!",
  });
});

// API route for fetching similar movies
app.get("/movies/similar", async (req, res) => {
  // This line imports axios which is a promise based HTTP client, to make API request.
  const axios = require("axios");
  // Fetches the TMDb API key from the .env file by using process.env
  const API_KEY = process.env.TMDB_API_KEY; // Replace with your TMDB API key
  // Sets the server port to an enviorment variable. Such as the one given by render during deployemnet.
  const port = process.env.PORT || 3000;
  // This stores the base URL for my TMDb API.
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";

  // takes the title query from the parameter from the request. In other words the name of the movie title the user eneters.
  const { title } = req.query;
  // This line returns an error if the user doesn't enetr a movie title.
  if (!title) {
    return res.status(400).json({ error: "Must Provide a movie title" });
  }

  try {
    // Calls the TMDb search endpoint to find a movie that matches the provided title.
    const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: API_KEY, query: title },
    });

    // Checks if no movies were found. If none were found it will return a 404 Not Found error.
    if (
      !searchResponse.data.results ||
      searchResponse.data.results.length === 0
    ) {
      return res.status(404).json({ error: "Movie not found." });
    }

    // Gets the ID of the first matching movie from the search results.
    const movieId = searchResponse.data.results[0].id;

    // Calls the TMDb endpoint to fetch a list of movies similar to the one identified by movieID.
    const similarMoviesResponse = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/similar`,
      {
        params: { api_key: API_KEY },
      }
    );
    // Sends a list of similar movies as a JSON response to the client side.
    res.json(similarMoviesResponse.data.results);
  } catch (error) {
    // Handles and errors by returninhg a 500 internal Server Error.
    console.error(
      "Error fetching similar movies:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "There was an error searching for similar movies" });
  }
});

// This will start the express server and listen on the specied port. It allows the app to handle incoming HTTP request.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
