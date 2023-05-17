var inputSearch = document.querySelector("#wordEnter");
var inputBtn = document.querySelector("#submitBtn");
var searchResult = document.querySelector("#searchResult")
var searchHistory = document.querySelector("#searchHistory");
var ulSearch = document.querySelector('#ulSearch');
var wordInput = document.querySelector('#word');


var apiCallFree = "https://api.dictionaryapi.dev/api/v2/entries/en/";
var apiCallWord = 'https://wordsapiv1.p.mashape.com/words/';

window.onload = function () {
    inputSearch.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            formSubmitHandler(event)
        }
    })
}


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

function formSubmitHandler(event) {
    event.preventDefault();
    var word = inputSearch.value;
    if (word) {
        getWord(word);
        inputSearch.value = "";
    } else {
        alert("Please enter a word");
    }


    function getWord(word, addToLocalStorage = true) {
    var apiUrl = apiCallFree + word;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var wordComplete = data[0].word;
                    wordInput.textContent = wordComplete;
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

    }
// Display word 
/*
var displayWord = function (content) {
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


  //get Next API
  var getNextApi = function (word) {
    var apiUrl2 = apiCallWord + word;
    fetch(apiUrl2)
      .then(function (response1) {
        if (response1.ok) {
          response1.json().then(function (dataFor) {
            displaySynon(dataFor);
          });
        } else {
          alert("Error: " + response1.statusText);
        }
      })
      .catch(function (error) {
        alert("Unable to connect to WordAPI");
      });















*/
inputBtn.addEventListener("click", formSubmitHandler);
