// ===== DOM Elements =====
const btnRandom  = document.getElementById('btn-random');
const btnAnother = document.getElementById('btn-another');
const btnReset   = document.getElementById('btn-reset');
const btnHome    = document.getElementById('btn-home');
const hero       = document.getElementById('hero');
const loader     = document.getElementById('loader');
const card       = document.getElementById('cocktail-card');

const cocktailImg          = document.getElementById('cocktail-img');
const cocktailBadge        = document.getElementById('cocktail-badge');
const cocktailName         = document.getElementById('cocktail-name');
const cocktailCategory     = document.getElementById('cocktail-category');
const cocktailGlass        = document.getElementById('cocktail-glass');
const ingredientsList      = document.getElementById('ingredients-list');
const cocktailInstructions = document.getElementById('cocktail-instructions');

// ===== API =====
const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

// ===== Reset to Landing Page =====
function resetToHome() {
  card.classList.add('hidden');
  loader.classList.add('hidden');
  hero.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Preload an image and return a promise =====
function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error('Image failed to load'));
    img.src = url;
  });
}

// ===== Fetch Random Cocktail =====
async function fetchRandomCocktail() {
  // Show loader, hide card & hero
  hero.classList.add('hidden');
  card.classList.add('hidden');
  loader.classList.remove('hidden');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    const drink = data.drinks[0];

    // Preload the image BEFORE showing the card
    await preloadImage(drink.strDrinkThumb);

    renderCocktail(drink);
  } catch (error) {
    console.error('Failed to fetch cocktail:', error);
    loader.classList.add('hidden');
    hero.classList.remove('hidden');
    alert('Oops! Could not fetch a cocktail. Please try again.');
  }
}

// ===== Render Cocktail =====
function renderCocktail(drink) {
  // Image (already preloaded, so it displays instantly)
  cocktailImg.src = drink.strDrinkThumb;
  cocktailImg.alt = drink.strDrink;

  // Badge (alcoholic / non-alcoholic)
  cocktailBadge.textContent = drink.strAlcoholic || 'Unknown';

  // Name
  cocktailName.textContent = drink.strDrink;

  // Meta chips — update the .chip-label spans inside the chips
  const categoryLabel = cocktailCategory.querySelector('.chip-label');
  const glassLabel    = cocktailGlass.querySelector('.chip-label');
  categoryLabel.textContent = drink.strCategory || 'Uncategorized';
  glassLabel.textContent    = drink.strGlass || 'Any glass';

  // Ingredients
  ingredientsList.innerHTML = '';
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure    = drink[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      const li = document.createElement('li');
      const measureText = measure && measure.trim() ? measure.trim() : '';
      li.innerHTML = measureText
        ? `<span class="measure">${measureText}</span> ${ingredient}`
        : ingredient;
      ingredientsList.appendChild(li);
    }
  }

  // Instructions
  cocktailInstructions.textContent = drink.strInstructions || 'No instructions available.';

  // Show card with animation
  loader.classList.add('hidden');
  card.classList.remove('hidden');

  // Re-trigger entrance animation
  card.style.animation = 'none';
  void card.offsetHeight; // force reflow
  card.style.animation = '';

  // Scroll the card into view
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Event Listeners =====
btnRandom.addEventListener('click', fetchRandomCocktail);
btnAnother.addEventListener('click', fetchRandomCocktail);
btnReset.addEventListener('click', resetToHome);

// Logo click also resets to home
btnHome.addEventListener('click', resetToHome);
btnHome.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    resetToHome();
  }
});
