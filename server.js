const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// ===== API URL =====
const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

// ===== Helper: parse ingredients from API response =====
function parseIngredients(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure && measure.trim() ? measure.trim() : ''
      });
    }
  }
  return ingredients;
}

// ===== Routes =====

// GET / — Landing page
app.get('/', (req, res) => {
  res.render('index', { drink: null, ingredients: [], error: null });
});

// GET /random — Fetch a random cocktail and render
app.get('/random', async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const drink = response.data.drinks[0];
    const ingredients = parseIngredients(drink);

    res.render('index', { drink, ingredients, error: null });
  } catch (err) {
    console.error('Error fetching cocktail:', err.message);
    res.render('index', { drink: null, ingredients: [], error: 'Could not fetch a cocktail. Please try again.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
