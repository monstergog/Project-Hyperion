// Var Selectors from HTMLd
var seenEl = document.querySelector("#seen");

// Baseline movie array
var baselineMovies = ["The Room", "Cowboys vs Dinosaurs", "Troll 2", "Cats", "Teenage Mutant Ninja Turtles III", "The Gingerdead Man" , "Birdemic: Shock And Terror" , "Jaws: The Revenge" , "The Wicker Man" , "Silent Night Deadly Night 2" , "Killer Klowns From Outer Space"];

// Get randomMovies from local storage if it exists, otherwise use baselineMovies
var randomMovies = JSON.parse(localStorage.getItem("randomMovies"));

// Check if randomMovies is null or undefined, and if it is, set it to baselineMovies and save it to local storage
if (!randomMovies) {
  randomMovies = baselineMovies;
  localStorage.setItem("randomMovies", JSON.stringify(randomMovies));
}

var randomMovie;
// Random Movie Generator
//Checks to see if movies have the seen value of "true"
var unseenMovies = randomMovies.filter(function(movie) {        
    return !movie.seen;
  });
  
  if (unseenMovies.length === 0) {
    console.log("No unseen movies left!");
    // applies a new movie
  } else {
    var randomIndex = Math.floor(Math.random() * unseenMovies.length);
    var randomMovie = unseenMovies[randomIndex];
  
    console.log("Random movie: " + randomMovie.title);
  }

//Seen Variable. This will add a listener and save a variable to local storage
seenEl.addEventListener("click", function() {
    // Saves the "seen" variable to local storage
    localStorage.setItem("seen", "true");

    // Find the movie randomly selected in the array
    var randomIndex = randomMovies.indexOf(randomMovie);

    // Checks to see if the movie is in the array. If it is it will remove it and update the movie list for the user
    if (randomIndex !== -1) {
        randomMovies.splice(randomIndex, 1, {
            title: randomMovie,
            seen: true
        });
    }

    // Updates the local storage with the updated movie list
    localStorage.setItem("randomMovies", JSON.stringify(randomMovies));

    // Reloads the page to reflect the changes
    location.reload();
});



var main = document.querySelector('main');

var apiKey;

// Prompts user for API key if one is not already stored in localstorage
function init () {
    var storedKey = JSON.parse(localStorage.getItem('storedKey', apiKey));

    if (storedKey === null) {
        apiKey = prompt ('Please Submit API Key:');
        localStorage.setItem('storedKey', JSON.stringify(apiKey))
    } else {
        apiKey = storedKey;
    }
}

const omdbAPI = 'https://www.omdbapi.com/?t=';

// Render random movie details the screen using data from OMDb API fetch
// 'twilight' being used as a placeholder movie, change to any movie or as a variable later
async function renderRandom() {
    await fetch(omdbAPI + randomMovie + '&apiKey=' + apiKey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        main.children[0].textContent = data.Title;
        main.children[1].src = data.Poster;
        main.children[2].textContent = data.Plot;
        main.children[3].textContent = "The IMDB Rating is: " + data.imdbRating;
        main.children[4].textContent = "Rotten Tomatoes Score: " + data.Ratings[1].Value + "🍅";
    });
}



// Render movie name and poster to the best of the worst using data from OMDb API fetch
async function renderCards() { 
    var movieCards = document.querySelector('article');
    for (var i = 0; i < movieCards.children.length; i++) {
        await fetch(omdbAPI + baselineMovies[i] + '&apiKey=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            movieCards.children[i].textContent = data.Title;
            
            var img = document.createElement('img');
            img.src = data.Poster;
            movieCards.children[i].append(img);
        })
    }
}

// Modal selectors
var modal = document.querySelector(".modal");
var closeButton = document.querySelector(".close");

// Event listener to close modal
closeButton.addEventListener("click", function() {
    modal.style.display = "none";
});

init();
renderRandom();
renderCards();