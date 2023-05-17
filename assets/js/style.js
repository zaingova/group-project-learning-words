var inputSearch = document.querySelector("#wordEnter");
var inputBtn = document.querySelector("#submitBtn");
var searchResult = document.querySelector("#searchResult")
var searchHistory = document.querySelector("#searchHistory");

var apiCallFree = "https://api.dictionaryapi.dev/api/v2/entries/en/";




window.onload = function () {
    inputSearch.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            formSubmitHandler(event);
        }
    });
}

/*var searchHistoryArray; 
if (localStorage.getItem("wordSearch")) {
    searchHistoryArray = JSON.parse(localStorage.getItem("wordSearch"));
    var newArr = searchHistoryArray.slice(0, 7);
    newArr.forEach(word => {
        var listBtn = document.createElement("li");
        var newBtn = document.createElement("button");
        newBtn.textContent = word;
        listBtn.appendChild(newBtn);
        ulSearch.appendChild(listBtn);
        newBtn.onclick = function () {
            getWord(word, false);
        }
    });
} else {
    searchHistoryArray = [];
}
*/
function formSubmitHandler(event) {
    event.preventDefault();
    var word = inputSearch.value;
    if (word) {
        getWord(word);
        inputSearch.value = "";
    } else {
        alert("Please enter a word");
    }
}
function getWord(word, addToLocalStorage = true) {
    var apiUrl = apiCallFree + word;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var wordComplete = data[0].word;
                    var wordInput = document.createElement("h3");
                    wordInput.textContent = wordComplete;
                    searchResult.appendChild(wordInput);
                    console.log(data)
                    if (addToLocalStorage) {
                        searchHistoryArray.unshift(wordComplete);
                        localStorage.setItem("wordSearch", JSON.stringify(searchHistoryArray));
                        var listBtn2 = document.createElement("li");
                        var newBtn2 = document.createElement("button");
                        newBtn2.textContent = wordComplete;
                        listBtn2.appendChild(newBtn2);
                        if (searchHistory.children.length > 7) {
                            searchHistory.removeChild(searchHistory.lastChild);
                        }
                        searchHistory.prepend(listBtn2);
                    }
                })
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Free Dictionary");
        });


    // Display word 
    var displayWord = function(content) {
        var temperatureEl = document.querySelector("#temperature");
        var descriptionEl = document.querySelector("#description");
        var humidityEl = document.querySelector("#humidity");

        var temperaturePrint = content.main.temp;
        var descriptionPrint = content.weather[0].main;
        var humidityPrint = content.main.humidity;
        outputSearch.setAttribute("style", "border:rgb(180, 215, 180) dashed 2px!important; border-radius:4px; align-items:center; padding:0px 5px 15px 5px");
        temperatureEl.textContent = "Temperature: " + temperaturePrint + " °C";
        descriptionEl.textContent = "Weather: " + descriptionPrint;
        humidityEl.textContent = "Humidity: " + humidityPrint + " %";

        getForecast(content.name)
    }
}

// inputBtn.addEventListener("click", formSubmitHandler);
// inputBtn.addEventListener("click", function(event) {
//     formSubmitHandler(event);
// });

// To activate the to Dogs images in the header-navbar panel with id "searchButton2" and in the main-section-newspanel div id "liveSportOdds" 

const searchButton = document.getElementById('searchButton2');

searchButton.addEventListener('click', () => {
  fetch('https://api.thedogapi.com/v1/images/search', {
    method: 'GET',
    headers: {
      'X-api-Key': 'live_ZJDADQZeNEYecTS1YkdWVsq0kSKBEh6MT4Vbcg4dH4EoquI4ZjyheBEduhxbVHLR',
    }
  })
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
      const breed = data[0]?.breeds[0]?.name;
      const imageUrl = data[0]?.url;

      // Create an image element
      const imageElement = document.createElement('img');
      imageElement.className = 'centered'; // Apply a CSS class for centering

      // Set maximum width and height for the image
      imageElement.style.maxWidth = '400px';
      imageElement.style.maxHeight = '300px';

      // Set the source and alt attributes
      imageElement.src = imageUrl;
      imageElement.alt = breed;

      // Clear the existing content of the div
      const liveSportOddsDiv = document.getElementById('liveSportOdds');
      liveSportOddsDiv.innerHTML = '';

      // Append the breed name and image to the div
      if (breed) {
        const breedNameElement = document.createElement('p');
        breedNameElement.className = 'centered'; // Apply a CSS class for centering
        breedNameElement.textContent = `Breed: ${breed}`;
        liveSportOddsDiv.appendChild(breedNameElement);
      }
      
      liveSportOddsDiv.appendChild(imageElement);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});






