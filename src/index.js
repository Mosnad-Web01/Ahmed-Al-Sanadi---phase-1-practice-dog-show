const BASE_URL = "http://localhost:3000/dogs";
const dogForm = document.getElementById('dog-form');
const tableBody = document.getElementById('table-body');

document.addEventListener('DOMContentLoaded', () => {
  fetchDogs();
});


async function fetchDogs() {
  try {
    const response = await fetch(BASE_URL);
    const dogs = await response.json();
    renderDogs(dogs);
  } catch (error) {
    console.error("Error fetching dogs:", error);
  }
}


function renderDogs(dogs) {
  tableBody.innerHTML = ''; 

  dogs.forEach(dog => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${dog.name}</td>
      <td>${dog.breed}</td>
      <td>${dog.sex}</td>
      <td><button data-id="${dog.id}" class="edit-btn">Edit</button></td>
    `;

    tableBody.appendChild(row);
  });

 
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const dogId = e.target.dataset.id;
      fetchDogDetails(dogId);
    });
  });
}


async function fetchDogDetails(dogId) {
  try {
    const response = await fetch(`${BASE_URL}/${dogId}`);
    const dog = await response.json();
    populateForm(dog);
  } catch (error) {
    console.error("Error fetching dog details:", error);
  }
}


function populateForm(dog) {
  dogForm.name.value = dog.name;
  dogForm.breed.value = dog.breed;
  dogForm.sex.value = dog.sex;
  dogForm.dataset.id = dog.id; 
}


dogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = dogForm.dataset.id;
  const updatedDog = {
    name: dogForm.name.value,
    breed: dogForm.breed.value,
    sex: dogForm.sex.value
  };

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedDog)
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    fetchDogs(); 
    dogForm.reset(); 
  } catch (error) {
    console.error("Error updating dog:", error);
  }
});
