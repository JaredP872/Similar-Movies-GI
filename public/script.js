// The async keyword allows the use of await inside of the function for handling async operations like API calls.
async function fetchSimilarMovies() {
  // Retrieves the value of the input field with the ID movieInput. This is where the user types in there selected movie.
  // .value gets the text entered by the user in the text box.
  const movieInput = document.getElementById("movieInput").value;
  // This line selectes the ul element with the ID results from the html. This is where the list of similar movies will show up.
  const resultsList = document.getElementById("results");
  //   This line will clear any content inside the <ul> with the ID results. This is to make sure that old results are removed before adding new ones.
  resultsList.innerHTML = "";

  //   This line will check if the user has entered a a movie inside of the text box. If they have not then an alert will be displayed. I'm using the return statement in order to exit the function early to stop the code from executing.
  if (!movieInput) {
    alert("Please enter a movie name!");
    return;
  }
  //  This line send a GET request to the server endpoint /movies/similar inclduimhg the movie name (title) serving as a query parameter.
  // encodeURIComponent(movieInput) makes sure that the movie name is encoded correcly for use in a URL.
  // Ex. replaces a space with a percent sign. (Red%One)
  // the fetch() function is async. await will pause the execution of the code and prevent it from running any further until the API response has been retrieved.
  try {
    const response = await fetch(
      `/movies/similar?title=${encodeURIComponent(movieInput)}`
    );
    // This line checks if the server returns an error.
    // If there is an error it reads the error message from response JSON.
    // Logs the error information to the browsers console. Thne throws a new error that will be caute by the catch block.
    // re-look over
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from server:", errorData);
      throw new Error(errorData.error || "An unknown error occured");
    }

    // Converts the successful response to a JS object by using .json(). This will make it so that the movies variable will contain an array of similar movies returned by the server.
    const movies = await response.json();

    // This will iterate over the movies array by using the .forEach() method.
    // Then creates a new li element by using document.createElement("li")
    // After the line above it Sets the movies title as the text content of the <li>.
    // Then finally appends the <li> to the <ul> element.
    movies.forEach((movie) => {
      const listItem = document.createElement("li");
      listItem.textContent = movie.title;
      resultsList.appendChild(listItem);
    });

    // Handles any errors that occur in the try block then logs the error details to the console to make for easy debugging.
    // alert is to show an simple error message to the user in case the catch block is activated.
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    alert("An error occurred. Please try again.");
  }
}
