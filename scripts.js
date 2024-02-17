async function getRecipes() {
    try {
        const response = await fetch('https://api-receitas-jhoj.onrender.com/recipes');
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Erro ao buscar as receitas:', error);
    }
}

async function addRecipe(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const newRecipe = {
        userName: formData.get('user-name'),
        recipeName: formData.get('recipe-name'),
        ingredients: formData.get('ingredients').split(','),
        instructions: formData.get('instructions')
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
            getRecipes(); // Atualiza a lista de receitas exibida na página
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
    event.preventDefault(); // Evita o comportamento padrão de enviar o formulário

    const searchInput = document.getElementById('search-input').value.trim();
    if (searchInput !== '') {
        await searchRecipes(searchInput);
    } else {
        // Se a entrada de pesquisa estiver vazia, exiba todas as receitas novamente
        getRecipes();
    }
}

function displayRecipes(recipes) {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = ''; // Limpa o conteúdo do contêiner

    const searchInput = document.getElementById('search-input').value.trim();
    recipes.forEach(recipe => {
        // Verifica se o nome da receita corresponde ao termo de pesquisa
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

// Adiciona um ouvinte de evento para o envio do formulário de adicionar receita
document.getElementById('recipe-form').addEventListener('submit', addRecipe);

// Adiciona um ouvinte de evento para o envio do formulário de pesquisa
document.getElementById('search-form').addEventListener('submit', handleSearch);

// Chama a função para buscar e exibir as receitas quando a página carrega
window.onload = getRecipes;
