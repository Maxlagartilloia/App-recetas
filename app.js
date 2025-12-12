const recipes = window.RECIPES;

const container = document.getElementById("recipesContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const modal = document.getElementById("recipeModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const themeToggle = document.getElementById("themeToggle");

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  loadCategories();
  render(recipes);
  openFromHash();
});

function loadCategories(){
  [...new Set(recipes.map(r=>r.category))].forEach(c=>{
    const o=document.createElement("option");
    o.value=c;o.textContent=c;
    categoryFilter.appendChild(o);
  });
}

function render(list){
  container.innerHTML="";
  list.forEach(r=>{
    const d=document.createElement("div");
    d.className="recipe-card";
    d.innerHTML=`
      <h3>${r.title}</h3>
      <p class="category">${r.category}</p>
    `;
    d.onclick=()=>openModal(r);
    container.appendChild(d);
  });
}

searchInput.oninput=filter;
categoryFilter.onchange=filter;

function filter(){
  const t=searchInput.value.toLowerCase();
  const c=categoryFilter.value;
  render(recipes.filter(r=>
    r.title.toLowerCase().includes(t) &&
    (c==="all"||r.category===c)
  ));
}

function openModal(r){
  location.hash=r.id;
  modalBody.innerHTML=`
    <h2>${r.title}</h2>
    <p><b>Tiempo:</b> ${r.time}</p>
    <p><b>Porciones:</b> ${r.servings}</p>
    <h4>Ingredientes</h4>
    <ul>${r.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
    <h4>Preparación</h4>
    <ol>${r.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
    ${r.notes?`<p><b>Notas:</b> ${r.notes}</p>`:""}
    <a href="https://wa.me/?text=${encodeURIComponent(r.title)}" target="_blank">📲 Compartir</a>
  `;
  modal.classList.remove("hidden");
}

closeModal.onclick=()=>modal.classList.add("hidden");

function loadTheme(){
  if(localStorage.theme==="dark"){
    document.body.classList.add("dark");
    themeToggle.textContent="☀️";
  }
}

themeToggle.onclick=()=>{
  document.body.classList.toggle("dark");
  localStorage.theme=document.body.classList.contains("dark")?"dark":"light";
  themeToggle.textContent=document.body.classList.contains("dark")?"☀️":"🌙";
}

function openFromHash(){
  const id=location.hash.replace("#","");
  const r=recipes.find(x=>x.id===id);
  if(r)openModal(r);
}
