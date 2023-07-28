const MAP_API_KEY = "Z2Olh8AiDpkye0o27ii8yHGpfXPmDkci";
let buttonEl = document.querySelector(".button");
let inputEl = document.querySelector(".textinput");


// let dropDownEl = document.querySelector(".dropdown")
// let button2El = document.querySelector(".button2")
// let states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
// button2El.addEventListener('click', )

let loc = "";
let searchedCities = [];


function InitiateBreweryUI(data){
  const brewerySectionDiv = document.getElementById('brewerySection');

  for(i = 0; i < data.length; i++){
    brewerySectionDiv.innerHTML += `
      <div class="box">
        <article class="media">
          <div class="media-left">
            <section class="image is-48x48">
              <img src="/assets/pexels-photo-1267700.webp" alt="beer beer-icon" />
            </section>
          </div>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>Name: ${data[i].name}</strong>
                <br />
              <div id="brew">Street: ${data[i].street ? data[i].street : 'Unavaliable'}</div>
              </p>
            </div>
            <div class="media-right">
              <section class="image is-128x128">
                <img id="image${i}" src="" alt="">
              </section>
            </div>
        </article>
      </div>
    `;
  }
}

// gets data from breweryAPI lat and lon
function getMap(data){
  let locations = inputEl.value;
  for (i = 0; i < data.length; i++){
    if (data[i].latitude !== null && data[i].longitude !== null){
      locations += `||${data[i].latitude},${data[i].longitude}`;
    }
  }
  // filters location
  let filter = `&locations=${locations}`;
  let mapApiUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=${MAP_API_KEY}${filter}`;
  fetch(mapApiUrl)
  .then(function (response) {
      return response.blob();
    }).then(function(data){
      const image = document.querySelector("#bigSingleMap");
      
      image.setAttribute("src", URL.createObjectURL(data));
      console.log(data);
    });
  }


function brew() {
  if (inputEl.value !== "") {
    fetch(
      `https://api.openbrewerydb.org/v1/breweries?by_city=${inputEl.value}`
      // &by_state=${states.value}
    )
      .then(function (response) {
        
        return response.json();
      })
      .then(function (data) {
        if(data){console.log(data)

          InitiateBreweryUI(data);
        }
        getMap(data);
        
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


      //experimenting - ignore
      //   for (j = 0; j < 10; j++) {
      //    for(i = 0; i < 2; i++ ){
      //     if (data[j].street !== null) {

      //     loc = data[i].street + "," + data[i].state
      //     getApi(loc,i);
      //   }}
      // }


      });
} else {
  alert("please enter a city");
}
}

// this is the static location data

// function getApi() {
//   fetch(
    
//   )
//     .then(function (response) {
//       console.log(response);
//       return response.blob();
//     })
//     // this returns the image data
//     .then(function (data) {
//       const image = document.querySelector("#image" + i);
      
//       image.setAttribute("src", URL.createObjectURL(data));
//       console.log(data);
//     });
// }
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

