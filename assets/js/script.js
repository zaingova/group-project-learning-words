var inputSearch = document.querySelector("#wordEnter");
var inputBtn = document.querySelector("#submitBtn");
var searchResult = document.querySelector("#searchResult")
var searchHistory = document.querySelector("#searchHistory");
var ulSearch = document.querySelector('#ulSearch');
var wordInput = document.querySelector('#word');
var mainPanel = document.querySelector('#mainPanel');


var apiCallFree = "https://api.dictionaryapi.dev/api/v2/entries/en/";
var apiCallWord = 'https://wordsapiv1.p.mashape.com/words/';
var synonyms = '/synonyms'

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
                    mainPanel.style.display = 'block';
                    wordInput.textContent = wordComplete;
                    console.log(data)
                    displayWord(data)
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

    

        var displayWord = function (data) {
        var wordSound = document.querySelector('#sound');
        var wordDef = document.querySelector('#definition');
        var wordEx = document.querySelector('#example');
        var wordType = document.querySelector('#wordType');
        var definitionPrint = data[0].meanings[0].definitions[0].definition;
        var soundPrint = data[0].phonetics[1].sourceUrl;
        /// var examplePrint = data[0].meaning[0].definition[0];
        var typePrint = data[0].meanings[0].partOfSpeech;
        wordDef.textContent = "Meanings: " + definitionPrint;
        wordSound.textContent = "Phonetic: " + soundPrint;
        wordType.textContent = 'Part of speech: ' + typePrint; 
    
        getNextApi(data[0].word)
        }
    }


  //get Next API
  var getNextApi = function (word) {
    var apiUrl2 = apiCallWord + word;
    fetch(apiUrl2)
      .then(function (response1) {
        console.log(response1)
        if (response1.ok) {
          response1.json().then(function (dataFor) {
            displaySynon(dataFor);
          });
        } else {
          alert("Error: " + response1.statusText);
        }
      })
      .catch(function (error) {
        alert("Unable to connect to Word Api");
      });


      //Display synonyms 
      var displaySynon = function (dataFor) {
        var day1 = document.querySelector("#day-1");
        
  
        forecastTitle.textContent = "5-Day Forecast"
  
        var day1Temp = dataFor.list[0].main.temp;
        var day1x = dataFor.list[0].weather[0].icon;
        var day1Desc = "http://openweathermap.org/img/w/" + day1x + ".png";
        var day1Wind = dataFor.list[0].wind.speed;
        var day1Date = dataFor.list[0].dt_txt;
        var day1Humidity = dataFor.list[0].main.humidity;


      }



        //getForecast(content.name)
}}

inputBtn.addEventListener("click", formSubmitHandler);