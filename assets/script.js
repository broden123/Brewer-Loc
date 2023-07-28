const MAP_API_KEY = "Z2Olh8AiDpkye0o27ii8yHGpfXPmDkci";
let buttonEl = document.querySelector(".button");
let inputEl = document.querySelector(".textinput");
let dropDownEl = document.querySelector(".ddstate")
let loc = "";
let searchedCities = [];

function InitiateBreweryUI(data) {
  const brewerySectionDiv = document.getElementById("brewerySection");

  for (i = 0; i < data.length; i++) {
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
              <div id="brew">Street: ${
                data[i].street ? data[i].street : "Unavaliable"
              }</div>
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
// function getMap(data) {
//   let locations = inputEl.value;
//   for (i = 0; i < data.length; i++) {
//     if (data[i].latitude !== null && data[i].longitude !== null) {
//       locations += `||${data[i].latitude},${data[i].longitude}`;
//     }
//   }
//   // filters location
//   let filter = `&locations=${locations}`;
//   let mapApiUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=${MAP_API_KEY}${filter}`;


//   fetch(mapApiUrl)
//     .then(function (response) {
//       return response.blob();
//     })
//     .then(function (data) {
//       const image = document.querySelector("#bigSingleMap");

//       image.setAttribute("src", URL.createObjectURL(data));
//       console.log(data);
//     });
// }

function brew() {

  if (inputEl.value !== "") {
    fetch(
      `https://api.openbrewerydb.org/v1/breweries?by_city=${inputEl.value}&by_state=${dropDownEl.value}&per_page=50`
     
    ) 
      .then(function (response) {
        
        return response.json();
      })
      .then(function (data) {
        if (data) {
          console.log(data);

          InitiateBreweryUI(data);
        }
        // getMap(data);
        var mapDrawLocations = [];
        var breweryNames = [];
        for (i = 0; i < data.length; i++) {
          if (data[i].address_1 == null){data[i].address_1 = ""}
          var addressConcate = data[i].address_1.replace('#','') + " " + data[i].city + " " + data[i].state;
          mapDrawLocations.push(addressConcate.concat());
          var nameConcate = data[i].name;
          breweryNames.push(nameConcate.concat());
          

          // mapDrawLocations.push(subArrayTwo.concat());
        }
        
        console.log(mapDrawLocations);
        console.log(breweryNames);
        
        //
        MQ.geocode()
          .search(mapDrawLocations)
          .on("success", function (e) {
            var results = e.result,
              html = "",
              group = [],
              features,
              marker,
              result,
              latlng,
              prop,
              best,
              val,
              map,
              r,
              i;

            map = L.map("map", {
              layers: MQ.mapLayer(),
            });

            for (i = 0; i < results.length; i++) {
              result = results[i].best;
              latlng = result.latlng;
              brewName = breweryNames[i];

              html += '<div style="width:300px; float:left;">';
              html +=
                "<p><strong>Geocoded Location #" + (i + 1) + "</strong></p>";

              for (prop in result) {
                r = result[prop];

                if (prop === "displayLatLng") {
                  val = r.lat + ", " + r.lng;
                } else if (prop === "mapUrl") {
                  val = '<br /><img src="' + r + '" />';
                } else {
                  val = r;
                }

                html += prop + " : " + val + "<br />";
              }

              html += "</div>";

              // create POI markers for each location
              marker = L.marker([latlng.lat, latlng.lng]).bindPopup(
                "<strong>" + brewName + "</strong>" + "</br>" + result.street
              );

              group.push(marker);
            }

            // add POI markers to the map and zoom to the features
            features = L.featureGroup(group).addTo(map);
            map.fitBounds(features.getBounds());
          });
        //
        //drawMap();
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
init()
      });
  } else {
    alert("please enter a city");
  }
}
buttonEl.addEventListener("click", brew);

function init() {
  // load search history on page load
  var data = localStorage.getItem("searchedCities");
  var searchedCities = data ? JSON.parse(data) : [];
console.log(searchedCities);
let historyCitiesEl = document.querySelector(".historyCities")
historyCitiesEl.textContent ='';
  if (searchedCities.value !== "") {
    for (i = 0; i < searchedCities.length; i++) {
      //add .append for each index of string here
      
      let divElh = document.createElement("div");
      divElh.setAttribute('class','m-5')
      divElh.setAttribute('id',searchedCities[i])
      historyCitiesEl.appendChild(divElh)
      divElh.textContent = searchedCities[i]

      divElh.addEventListener("click",function(){
        console.log(this.textContent)
      })
    }
  }

  

}

init()

// let historyArray = [];

// function renderHistory() {

// let historyEl = document.querySelector('#history');

// // historyEl.push(inputEl.value);
// for (let index = 0; index < historyArray.length; index++) {
//   let hist = historyArray[index];
// }
// ViewScore.addEventListener('click', function (){
  
//   console.log(ViewScore);
// });
// }




