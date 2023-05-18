
// To activate the to Dogs images in the header-navbar panel with id "searchButton2" and in the main-section-newspanel div id "liveSportOdds" 

const searchButton = document.getElementById('dogBtn');

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
      imageElement.style.maxWidth = '300px';
      imageElement.style.maxHeight = '300px';

      // Set the source and alt attributes
      imageElement.src = imageUrl;
      imageElement.alt = breed;

      // Clear the existing content of the div
      const dogPanelDiv = document.getElementById('dogPanel');
      dogPanelDiv.innerHTML = '';

      // Append the breed name and image to the div
      if (breed) {
        const breedNameElement = document.createElement('p');
        breedNameElement.className = 'centered'; // Apply a CSS class for centering
        breedNameElement.textContent = `Breed: ${breed}`;
        dogPanelDiv.appendChild(breedNameElement);
      }
      
      dogPanelDiv.appendChild(imageElement);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

// To activate the Cat images  

var searchButton2 = document.getElementById('catBtn');

searchButton2.addEventListener('click', () => {
  fetch('https://api.thecatapi.com/v1/images/search', {
    method: 'GET',
    headers: {
      'X-api-Key': 'live_d6uoYVoUGgWSJVyAIXKPsxumfl7fqW8d2XfGkeUlLmLoF2Is5uhNSnN4lkO1xyBM',
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
      imageElement.style.maxWidth = '300px';
      imageElement.style.maxHeight = '300px';

      // Set the source and alt attributes
      imageElement.src = imageUrl;
      imageElement.alt = breed;

      // Clear the existing content of the div
      const catPanelDiv = document.getElementById('catPanel');
      catPanelDiv.innerHTML = '';

      // Append the breed name and image to the div
      if (breed) {
        const breedNameElement = document.createElement('p');
        breedNameElement.className = 'centered'; // Apply a CSS class for centering
        breedNameElement.textContent = `Breed: ${breed}`;
        catPanelDiv.appendChild(breedNameElement);
      }
      
      catPanelDiv.appendChild(imageElement);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});