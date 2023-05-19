//Set the variables in order to select the HTML Element 
var inputSearch = document.querySelector("#wordEnter");
var randomBtn = document.querySelector("#randWordBtn");
var inputBtn = document.querySelector("#submitBtn");
var searchResult = document.querySelector("#searchResult")
var searchHistory = document.querySelector("#searchHistory");
var ulSearch = document.querySelector('#ulSearch');
var wordInput = document.querySelector('#word');
var mainPanel = document.querySelector('#mainPanel');
var dogBtn = document.querySelector("#dogBtn");

// API variables - Free Dictionary and Words API from NINJA Library
var apiCallFree = "https://api.dictionaryapi.dev/api/v2/entries/en/";


var wordDataLoaded = false;

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
            removePicture();
        };
    });
} else {
    searchHistoryArray = [];
}

// Set button for pick a random - using AJAX for Random word API from NINJA Library- word and set into the input element
randomBtn.addEventListener("click", function (event) {
    event.preventDefault()
    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/randomword',
        headers: { 'X-Api-Key': 'Eqn6iIwGxn1CRPg74znFPw==4cZzEWjtkFHJ2qcX' },
        contentType: 'application/json',
        success: function (result) {
            var randomWord = result.word;
            console.log(randomWord)
            inputSearch.value = randomWord;
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    })
});

/// Principal trigger for search button
function formSubmitHandler(event) {
    event.preventDefault();
    removePicture()
    var word = inputSearch.value;
    if (word) {
        getWord(word);
        inputSearch.value = "";
    } else {
        blurt('Please enter a word');
    }
}

//Word validation
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

// Fetch word input element
function getWord(word, addToLocalStorage = true) {
    var apiUrl = apiCallFree + word;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    wordDataLoaded = true;
                    var wordComplete = data[0].word;
                    mainPanel.style.display = 'block';
                    wordInput.textContent = wordComplete;
                    console.log(data);
                    displayWord(data);
                    getSynonym(word);
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
                            removePicture();
                        };
                    }
                });
            } else {
                ///Call bootstrap for ERROR
                blurt('This word is not in our dictionary. Try a different one')
            }
        })
        .catch(function (error) {
            blurt('Unable to connect to Free Dictionary')
        });
}

// Second fetch to word API
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
            blurt('Unable to connect to Ninja API');
        }
    })
        .catch(function (error) {
            blurt('Unable to connect to Ninja API');
        });
}

// Display word 
function displayWord(data) {
    var wordSound = document.querySelector('#sound');
    var wordDef = document.querySelector('#definition');
    var wordEx = document.querySelector('#example');
    var wordType = document.querySelector('#wordType');

    //Print definition
    var definitionPrint = data[0].meanings[0].definitions[0].definition;
    wordDef.textContent = "Meaning: " + definitionPrint;

    //Print type of word
    var typePrint = data[0].meanings[0].partOfSpeech;
    wordType.textContent = 'Part of speech: ' + typePrint;

    //Print URL for more info about the word
    var examplePrint = data[0].sourceUrls[0];
    wordEx.setAttribute("href", examplePrint);
    wordEx.textContent = examplePrint;

    var src = '';

    // if there is NO audio data...
    if (((data[0].phonetics).length) == 0) {
        wordSound.style.display = "none";
        wordSound.setAttribute("src", '');
    } else {
        // if there IS audio data, loop through all phonetic and make the audio div VISIBLE
        wordSound.style.display = "block";
        for (var i = 0; i < (data[0].phonetics).length; i++) {
            // on each iteration, local src var is made to equal the audio data
            src = data[0].phonetics[i].audio;

            // as soon as the audio isnt empty, break out of the loop
            if (src != '') {
                break;
            }
        }
    }

    // if after iterating through all phonetics, there is no readable data...
    if (src == '') {
        // hide the audio
        wordSound.style.display = "none";
    } else {
        // otherswise, sets the audio src to the local src variable
        wordSound.setAttribute("src", src);
    }

    searchHistory.setAttribute("style", "display:block");
}

// function for displaying a list of synonyms for the given word
function displaySynon(data) {
    var wordSynonym = document.querySelector('#synonym');
    var synonymPrint = [...data.synonyms.values()];
    var allSynonyms = synonymPrint.join(', ');
    wordSynonym.textContent = "Synonyms: " + allSynonyms;
}

// gets the dogBtn and catBtn element from the HTML
const dogBtnEl = document.getElementById('dogBtn');
var catButtonEl = document.getElementById('catBtn');

// event listener for click event
dogBtnEl.addEventListener('click', (event) => {
    event.preventDefault();
    fetch('https://api.thedogapi.com/v1/images/search', {
        method: 'GET',
        headers: {
            'X-api-Key': 'live_ZJDADQZeNEYecTS1YkdWVsq0kSKBEh6MT4Vbcg4dH4EoquI4ZjyheBEduhxbVHLR',
        }
    })

        // Parse response as JSON
        .then(response => response.json())
        .then(data => {
            // if a word has been entered into the search bar...
            if (wordDataLoaded) {
                // execute this code to load a picture
                const breed = data[0]?.breeds[0]?.name;
                const imageUrl = data[0]?.url;
                console.log(data[0]?.breeds[0]?.name);

                // Create an image element
                const imageElement = document.createElement('img');
                const breedNameElement = document.createElement('p');

                // Set maximum width and height for the image
                imageElement.style.maxWidth = '500px';
                imageElement.style.maxHeight = '400px';

                // Set the source and alt attributes
                imageElement.classList.add("animalImage");
                imageElement.src = imageUrl;
                imageElement.alt = "dogImage";

                // Clear the existing content of the div
                const dogPanelDiv = document.getElementById('dogPanel');
                dogPanelDiv.innerHTML = '';

                // Append the breed name and image to the div
                if (breed !== undefined) {
                    dogPanelDiv.style.display = 'block'
                    breedNameElement.textContent = `Breed: ${breed}`;
                    dogPanelDiv.appendChild(breedNameElement);
                } else if (breed === undefined) {
                    dogPanelDiv.style.display = 'block'
                    breedNameElement.textContent = `Breed: Funny dog`;
                    dogPanelDiv.appendChild(breedNameElement);
                }
                dogPanelDiv.appendChild(imageElement);
            } else {
                // otherwise, sends an alert
                blurt("You need to enter a word before you can load this image!");
            }

        })
        .catch(error => {
            blurt('Error connecting to server!');
        });
});

catButtonEl.addEventListener('click', (event) => {
    event.preventDefault();
    fetch('https://api.thecatapi.com/v1/images/search', {
        method: 'GET',
        headers: {
            'X-api-Key': 'live_d6uoYVoUGgWSJVyAIXKPsxumfl7fqW8d2XfGkeUlLmLoF2Is5uhNSnN4lkO1xyBM',
        }
    })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            // if a word has been entered into the search bar...
            if (wordDataLoaded) {
                // execute this code to load a picture
                const breed = data[0]?.breeds[0]?.name;
                const imageUrl = data[0]?.url;

                // Create an image element
                const imageElement = document.createElement('img');
                const breedNameElement = document.createElement('p');

                // Set maximum width and height for the image
                imageElement.style.maxWidth = '500px';
                imageElement.style.maxHeight = '400px';

                // Set the source and alt attributes
                imageElement.classList.add("animalImage");
                imageElement.src = imageUrl;
                imageElement.alt = "catImage";

                // Clear the existing content of the div
                const catPanelDiv = document.getElementById('catPanel');
                catPanelDiv.innerHTML = '';

                // Append the breed name and image to the div
                if (breed !== undefined) {
                    catPanelDiv.style.display = 'block'
                    breedNameElement.textContent = `Breed: ${breed}`;
                    catPanelDiv.appendChild(breedNameElement);
                } else if (breed === undefined) {
                    catPanelDiv.style.display = 'block'
                    breedNameElement.textContent = `Breed: Funny cat`;
                    catPanelDiv.appendChild(breedNameElement);
                }


                catPanelDiv.appendChild(imageElement);
            } else {
                // otherwise, sends an alert
                blurt("You need to enter a word before you can load this image!");
            }

        })
        .catch(error => {
            blurt('Error connecting to server!');
        });
});

function removePicture() {
    const catPanelDiv = document.getElementById('catPanel');
    const dogPanelDiv = document.getElementById('dogPanel');
    catPanelDiv.style.display = 'none'
    dogPanelDiv.style.display = 'none'
};

//Trigger
inputBtn.addEventListener("click", formSubmitHandler);

