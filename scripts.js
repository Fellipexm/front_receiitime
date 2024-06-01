function displayLoadingMessage() {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = '<div id="loading-message">Carregando...</div>';
}

function hideLoadingMessage() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
}

async function getRecipes() {
    try {
        displayLoadingMessage();
        const response = await fetch('https://api-receitas-jhoj.onrender.com/recipes');
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Erro ao buscar as receitas:', error);
    } finally {
        hideLoadingMessage();
    }
}

async function addRecipe(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const userName = formData.get('user-name');
    const recipeName = formData.get('recipe-name');
    const ingredients = formData.get('ingredients');
    const instructions = formData.get('instructions');

    if (!userName || !recipeName || !ingredients || !instructions) {
        alert('Por favor, preencha todos os campos do formulário.');
        return;
    }

    const newRecipe = {
        userName,
        recipeName,
        ingredients: ingredients.split(','),
        instructions
    };

    try {
        const response = await fetch('https://api-receitas-jhoj.onrender.com/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecipe)
        });
        if (response.ok) {
            console.log('Receita adicionada com sucesso!');
            form.reset();
            getRecipes();
        } else {
            console.error('Erro ao adicionar a receita:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao adicionar a receita:', error);
    }
}

async function searchRecipes(keyword) {
    try {
        const response = await fetch(`https://api-receitas-jhoj.onrender.com/recipes?q=${keyword}`);
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Erro ao buscar as receitas:', error);
    }
}

async function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value.trim();
    if (searchInput !== '') {
        await searchRecipes(searchInput);
    } else {
        getRecipes();
    }
}

function displayRecipes(recipes) {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = '';
    const searchInput = document.getElementById('search-input').value.trim();
    if (recipes.length === 0) {
        recipeContainer.innerHTML = '<p>Nenhuma receita encontrada.</p>';
    } else {
        recipes.forEach(recipe => {
            if (recipe.recipeName.toLowerCase().includes(searchInput.toLowerCase())) {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                const title = document.createElement('h2');
                title.textContent = recipe.recipeName;
                const userName = document.createElement('p');
                userName.textContent = 'Nome do Usuário: ' + recipe.userName;
                const ingredients = document.createElement('p');
                ingredients.textContent = 'Ingredientes: ' + recipe.ingredients.join(', ');
                const instructions = document.createElement('p');
                instructions.textContent = 'Instruções: ' + recipe.instructions;
                recipeDiv.appendChild(title);
                recipeDiv.appendChild(userName);
                recipeDiv.appendChild(ingredients);
                recipeDiv.appendChild(instructions);
                recipeContainer.appendChild(recipeDiv);
            }
        });
    }
}

document.getElementById('recipe-form').addEventListener('submit', addRecipe);
document.getElementById('search-form').addEventListener('submit', handleSearch);
window.onload = getRecipes;
