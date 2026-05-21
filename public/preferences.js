document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate');
    const goalSelect = document.getElementById('goal');
    const dietSelect = document.getElementById('diet');
    const mealsContainer = document.getElementById('meals-container');
  
    generateButton.addEventListener('click', () => {
      const goal = goalSelect.value;
      const diet = dietSelect.value;
  
      fetch(`/get-meals?goal=${goal}&diet=${diet}`)
        .then(response => response.json())
        .then(data => {
          mealsContainer.innerHTML = '';
          data.meals.forEach(meal => {
            const mealDiv = document.createElement('div');
            mealDiv.classList.add('meal');
            mealDiv.innerHTML = `
              <h3>${meal.name}</h3>
              <p><strong>Calories:</strong> ${meal.calories}</p>
              <p><strong>Ingredients:</strong> ${meal.ingredients.join(', ')}</p>
            `;
            mealsContainer.appendChild(mealDiv);
          });
        })
        .catch(err => {
          mealsContainer.innerHTML = `<p style="color: red;">Failed to load meals.</p>`;
          console.error("Error fetching meals:", err);
        });
    });
  });
  