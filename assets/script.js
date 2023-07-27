let buttonEl = document.querySelector(".button");
let inputEl = document.querySelector(".textinput");

let loc = "";
let searchedCities = [];

function brew() {
  if (inputEl.value !== "") {
    fetch(
      "https://api.openbrewerydb.org/v1/breweries?by_city=" +
        inputEl.value +
        "&per_page=5%20"
    )
      .then(function (response) {
        console.log(inputEl);
        return response.json();
      })

      .then(function (data) {
        console.log(data);

        for (i = 0; i < data.length; i++) {
          if (data[i].street !== null) {
            loc = loc + data[i].street + "," + data[i].state + "||";

            console.log(loc);
          }
        }
        //set search history to array
        var city = inputEl.value;
        console.log(city);
        var data = localStorage.getItem("searchedCities");
        var searchedCities = data ? JSON.parse(data) : [];
        searchedCities.push(city);
        //filter search history to prevent duplicates then set to local storage
        let filteredSearchHistory = searchedCities.filter((element, index) => {
          return searchedCities.indexOf(element) === index;
        });
        localStorage.setItem(
          "searchedCities",
          JSON.stringify(filteredSearchHistory)
        );
        // run api fetch function
        getApi(loc);
      });
  } else {
    alert("please enter a city");
  }
}

// this is the static location data

function getApi(loc) {
  fetch(
    "https://www.mapquestapi.com/staticmap/v5/map?locations=" +
      loc +
      "&size=@2x&key=Z2Olh8AiDpkye0o27ii8yHGpfXPmDkci"
  )
    .then(function (response) {
      console.log(response);
      return response.blob();
    })
    // this returns the image data
    .then(function (data) {
      const image = document.querySelector("#image");
      image.setAttribute("src", URL.createObjectURL(data));
      console.log(data);
    });
}
buttonEl.addEventListener("click", brew);

function init() {
  // load search history on page load
  var data = localStorage.getItem("searchedCities");
  var searchedCities = data ? JSON.parse(data) : [];
  if (searchedCities.value !== "") {
    for (i = 0; i < searchedCities.length; i++) {
      //add .append for each index of string here
    }
  }
}
