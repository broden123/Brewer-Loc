const MAP_API_KEY = "Z2Olh8AiDpkye0o27ii8yHGpfXPmDkci";
let buttonEl = document.querySelector(".button");
let inputEl = document.querySelector(".textinput");
let dropDownEl = document.querySelector(".ddstate");
let loc = "";
let searchedCities = [];
let mapEl = document.querySelector("#map");

function InitiateBreweryUI(data) {
  // clear results before populating
  function initializingResults() {
    const list = document.getElementById("brewerySection");

    if (list !== null) {
      while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
      }
    }
  }
  initializingResults();
// These are boxes that store brewery name, address (if avaliable), and website(if avaliable)
  const brewerySectionDiv = $("#brewerySection");
  for (i = 0; i < data.length; i++) {
    brewerySectionDiv.append(`
      <div class="box article-container">
        <article class="media">
          <div class="media-left">
          </div>
          <div class="media-content">
            <div class="content has-text-light has-text-centered">
              <p>
                <strong class="has-text-light ">${data[i].name}</strong>
                <br />
              <div id="brew">Street: ${
                data[i].street ? data[i].street : "Unavaliable"
              }</div>
              </p>
              <a class="has-text-light" href=${
                data[i].website_url ? data[i].website_url : ""
              }>Website: ${
      data[i].website_url ? data[i].website_url : "Unavaliable"
    }</a>

        </article>
      </div>
    `);
  }
}

function brew() {
  if (inputEl.value !== "") {
    fetch(
      `https://api.openbrewerydb.org/v1/breweries?by_city=${inputEl.value}&by_state=${dropDownEl.value}&per_page=50`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //if the search returns nothing, warning modal
        if (data.length == 0) {
          console.log("hi");
          let popupEl = $(".popupHolder");
          popupEl.append(` <div class="notification  is-warning"><button class="delete"></button>
         Please enter a 
          <strong> valid </strong>, 
          city name.</div>`);

          //clicking x removes notification:
          $(".delete").on("click", function () {
            $(".notification").remove();
          });
          return;
        }
        if (data) {
          InitiateBreweryUI(data);
        }

        // getMap(data);
        var mapDrawLocations = [];
        var breweryNames = [];
        for (i = 0; i < data.length; i++) {
          if (data[i].address_1 == null) {
            data[i].address_1 = "";
          }
          var addressConcate =
            data[i].address_1.replace("#", "") +
            " " +
            data[i].city +
            " " +
            data[i].state;
          mapDrawLocations.push(addressConcate.concat());
          var nameConcate = data[i].name;
          breweryNames.push(nameConcate.concat());

          inputEl.textContent = "";
          // mapDrawLocations.push(subArrayTwo.concat());
        }
        function initializingMap() {
          var container = L.DomUtil.get("map");
          if (container != null) {
            map.remove();
            let mapcontElh = document.getElementById("mapcontainer");
            let mapElh = document.createElement("div");
            mapElh.setAttribute("style", "width: 100%; height:530px;");
            mapElh.setAttribute("id", "map");
            mapcontElh.appendChild(mapElh);
          }
        }

        initializingMap();
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
        //set search history to array
        var city = inputEl.value;
        let state = dropDownEl.value;
        var data = localStorage.getItem("searchedCities");
        var searchedCities = data ? JSON.parse(data) : [];
        searchedCities.push(city + ", " + state);
        //filter search history to prevent duplicates then set to local storage
        let filteredSearchHistory = searchedCities.filter((element, index) => {
          return searchedCities.indexOf(element) === index;
        });

        localStorage.setItem(
          "searchedCities",
          JSON.stringify(filteredSearchHistory)
        );
        init();
      });
  } else {
    //if city is invalid or null, popup modal
    let popupEl = $(".popupHolder");
    popupEl.append(` <div class="notification  is-warning"><button class="delete"></button>
   Please enter a 
    <strong> valid </strong>, 
    city name.</div>`);

    //clicking x removes notification:
    $(".delete").on("click", function () {
      $(".notification").remove();
    });
  }
}

buttonEl.addEventListener("click", brew);

function init() {
  // load search history on page load
  var data = localStorage.getItem("searchedCities");
  var searchedCities = data ? JSON.parse(data) : [];

  let historyCitiesEl = document.querySelector(".historyCities");
  historyCitiesEl.textContent = "";

  if (searchedCities.value !== "") {
    for (i = 0; i < searchedCities.length; i++) {
      //add .append for each index of string here
      let divElh = document.createElement("div");
      divElh.setAttribute("class", "box is-inline-block mx-5 has-text-light has-background-dark p-1 is-size-5");
      divElh.setAttribute("id", i);
      divElh.setAttribute("style", "text-transform: capitalize");
      divElh.setAttribute("onclick", "recall(" + i + ")");
      historyCitiesEl.appendChild(divElh);
      divElh.textContent = searchedCities[i];

      divElh.addEventListener("click", function () {
        // console.log(this.textContent)
      });
    }
  }
}

init();

function clearHist() {
  let historyCitiesEl = document.querySelector(".historyCities");
  historyCitiesEl.textContent = "";
  localStorage.clear();
  searchedCities = [];
}

function recall(x) {
  let tata = JSON.parse(localStorage.getItem("searchedCities"));
  let tataA = tata[x];
  let tataB = tataA.toString();
  let tataC = tataB.replace(",", "");
  let tataD = tataC.split(" ");
  let tataE = tataD[0];
  let tataF = tataD[1];

  if (tataC !== "") {
    fetch(
      `https://api.openbrewerydb.org/v1/breweries?by_city=${tataE}&by_state=${tataF}&per_page=50`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data) {
          console.log(data);

          InitiateBreweryUI(data);
        }

        var mapDrawLocations = [];
        var breweryNames = [];
        for (i = 0; i < data.length; i++) {
          if (data[i].address_1 == null) {
            data[i].address_1 = "";
          }
          var addressConcate =
            data[i].address_1.replace("#", "") +
            " " +
            data[i].city +
            " " +
            data[i].state;
          mapDrawLocations.push(addressConcate.concat());
          var nameConcate = data[i].name;
          breweryNames.push(nameConcate.concat());

          inputEl.textContent = "";
        }

        function initializingMap() {
          var container = L.DomUtil.get("map");
          if (container != null) {
            map.remove();
            let mapcontElh = document.getElementById("mapcontainer");
            let mapElh = document.createElement("div");
            mapElh.setAttribute("style", "width: 100%; height:530px;");
            mapElh.setAttribute("id", "map");
            mapcontElh.appendChild(mapElh);
          }
        }
        initializingMap();
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

        init();
      });
  }
}
