/* ==============================
   DATA
================================ */
const recipes = window.RECIPES || [];

/* ==============================
   ELEMENTS
================================ */
const container = document.getElementById("recipesContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const modal = document.getElementById("recipeModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");
const themeToggle = document.getElementById("themeToggle");

/* ==============================
   STATE
================================ */
let currentRecipes = [...recipes];

/* ==============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  populateCategories();
  renderRecipes(currentRecipes);
});

/* ==============================
   THEME
================================ */
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

/* ==============================
   CATEGORIES
================================ */
function populateCategories() {
  const categories = [...new Set(recipes.map(r => r.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

/* ==============================
   RENDER RECIPES
================================ */
function renderRecipes(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No se encontraron recetas.</p>";
    return;
  }

  list.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <p class="category">${recipe.category}</p>
    `;
    card.addEventListener("click", () => openModal(recipe));
    container.appendChild(card);
  });
}

/* ==============================
   SEARCH & FILTER
================================ */
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  currentRecipes = recipes.filter(recipe => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(search);
    const matchesCategory =
      category === "all" || recipe.category === category;
    return matchesSearch && matchesCategory;
  });

  renderRecipes(currentRecipes);
}

/* ==============================
   MODAL
================================ */
function openModal(recipe) {
  modalBody.innerHTML = `
    <h2>${recipe.title}</h2>
    <p><strong>Categoría:</strong> ${recipe.category}</p>
    <p><strong>Tiempo:</strong> ${recipe.time}</p>
    <p><strong>Porciones:</strong> ${recipe.servings}</p>

    <h4>Ingredientes</h4>
    <ul>
      ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
    </ul>

    <h4>Preparación</h4>
    <ol>
      ${recipe.steps.map(s => `<li>${s}</li>`).join("")}
    </ol>

    ${
      recipe.notes
        ? `<h4>Notas</h4><p>${recipe.notes}</p>`
        : ""
    }
  `;

  modal.classList.remove("hidden");
}

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.add("hidden");
}
