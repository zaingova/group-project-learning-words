//Set the variables in order to select the HTML Element 
var inputSearch = document.querySelector("#wordEnter");
var inputBtn = document.querySelector("#submitBtn");
var searchResult = document.querySelector("#searchResult")
var searchHistory = document.querySelector("#searchHistory");
var ulSearch = document.querySelector('#ulSearch');
var wordInput = document.querySelector('#word');
var mainPanel = document.querySelector('#mainPanel');

// API variables
var apiCallFree = "https://api.dictionaryapi.dev/api/v2/entries/en/";
var apiCallWord = 'https://wordsapiv1.p.mashape.com/words/';
var synonyms = '/synonyms';

  /// Keypress event in search bar
inputSearch.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        formSubmitHandler(event);
    }
});


  // Get search history from localStorage
var searchHistoryArray;

if (localStorage.getItem("wordSearch")) {
    searchHistoryArray = JSON.parse(localStorage.getItem("wordSearch"));
    var newArr = searchHistoryArray.slice(0, 9);
    newArr.forEach(word => {
        searchHistory.setAttribute("style", "display:block");
        var listBtn = document.createElement("li");
        var newBtn = document.createElement("button");
        newBtn.textContent = word;
        listBtn.appendChild(newBtn);
        ulSearch.appendChild(listBtn);
        // Do a fetch on the buttons displayed but does not include again in the localStorage
        newBtn.onclick = function () {
            getWord(word, false);
        };
    });
} else {
    searchHistoryArray = [];
}


  /// Principal trigger 
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
 // Fetch current word
function getWord(word, addToLocalStorage = true) {
    var apiUrl = apiCallFree + word;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var wordComplete = data[0].word;
                    mainPanel.style.display = 'block';
                    wordInput.textContent = wordComplete;
                    console.log(data);
                    displayWord(data);
                    if (addToLocalStorage) {
                        // Add word to search history array and save to localStorage
                        searchHistoryArray.unshift(wordComplete);
                        localStorage.setItem("wordSearch", JSON.stringify(searchHistoryArray));
                         // Add word to search history list
                        var newBtn2 = document.createElement("button");
                        newBtn2.textContent = wordComplete;
                        ulSearch.appendChild(newBtn2);
                             // Only show 10 elements in  history-search
                        if (searchHistory.children.length > 9) {
                            searchHistory.removeChild(searchHistory.lastChild);
                        }
                        var listBtn = document.createElement("li");
                        searchHistory.prepend(listBtn);
                        newBtn2.onclick = function () {
                            getWord(word, false);
                        };
                    }
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Free Dictionary");
        });
}

// Display word 

function displayWord(data) {
    var wordSound = document.querySelector('#sound');
    var wordDef = document.querySelector('#definition');
    var wordEx = document.querySelector('#example');
    var wordType = document.querySelector('#wordType');
    var definitionPrint = data[0].meanings[0].definitions[0].definition;
    var soundPrint = data[0].phonetics[1].sourceUrl;
    var typePrint = data[0].meanings[0].partOfSpeech;
    wordDef.textContent = "Meanings: " + definitionPrint;
    wordSound.textContent = "Phonetic: " + soundPrint;
    wordType.textContent = 'Part of speech: ' + typePrint;
}

//Trigger
inputBtn.addEventListener("click", formSubmitHandler);




/*get Next API
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


        var displayWord = function (data) {
        var wordSound = document.querySelector('#sound');
        var wordDef = document.querySelector('#definition');
        var wordEx = document.querySelector('#example');
        var wordType = document.querySelector('#wordType');
        var definitionPrint = data[0].meanings[0].definitions[0].definition;
        /// var examplePrint = data[0].meaning[0].definition[0];
        var typePrint = data[0].meanings[0].partOfSpeech;
        wordDef.textContent = "Meanings: " + definitionPrint;
        //wordSound.textContent = "Phonetic: " + soundPrint;
        //wordSound = "https://api.dictionaryapi.dev/media/pronunciations/en/cat-us.mp3";
        wordType.textContent = 'Part of speech: ' + typePrint;
        wordSound.setAttribute("src", data[0].phonetics[1].audio);
    
        getNextApi(data[0].word)
        }
    }



      //getForecast(content.name)}*/