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
        getSynonym(word);
        inputSearch.value = "";
    } else {
        alert("Please enter a word");
    }
}

function wordValid(data) {
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // if (data[0].) {

                    // }
                })
            }
        })
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
                        newBtn2.classList.add("col");
                        newBtn2.classList.add("s3");
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

function getSynonym(word) {
    fetch('https://api.api-ninjas.com/v1/thesaurus?word=' + word, {
        headers: {
            'X-Api-Key': 'Eqn6iIwGxn1CRPg74znFPw==4cZzEWjtkFHJ2qcX'
        }
    }).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displaySynon(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to connect to Ninja Api");
        });
}

// Display word 

function displayWord(data) {
    var wordSound = document.querySelector('#sound');
    var wordDef = document.querySelector('#definition');
    var wordEx = document.querySelector('#example');
    var wordType = document.querySelector('#wordType');
    var definitionPrint = data[0].meanings[0].definitions[0].definition;
    var typePrint = data[0].meanings[0].partOfSpeech;
    wordDef.textContent = "Meaning: " + definitionPrint;

    var src = '';

    // if there is NO audio data...
    if (((data[0].phonetics).length) == 0) {
        wordSound.setAttribute("src", '');
    }

    // if there IS audio data, loop through all phonetic indicies
    for (var i = 0; i < (data[0].phonetics).length; i++) {
        // on each iteration, local src var is made to equal the audio data
        src = data[0].phonetics[i].audio;

        // as soon as the audio isnt empty, break out of the loop
        if (src != '') {
            break;
        }
    }


    // sets the audio src to the local src variable
    wordSound.setAttribute("src", src);

    wordType.textContent = 'Part of speech: ' + typePrint;

    // GABRIEL: I moved this down here so the search history loads AFTER the results are displayed
    searchHistory.setAttribute("style", "display:block");
}

function displaySynon(data) {
    var wordSynonym = document.querySelector('#synonym');
    var synonymPrint = [data.synonyms.values()];
    var allSynonyms = synonymPrint.join(', ');
    wordSynonym.textContent = "Synonyms: " + allSynonyms;


}




//Trigger
inputBtn.addEventListener("click", formSubmitHandler);


 

/*
    var word = 'bright'
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/thesaurus?word=' + word,
    headers: { 'X-Api-Key': 'Eqn6iIwGxn1CRPg74znFPw==4cZzEWjtkFHJ2qcX'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});
*/

