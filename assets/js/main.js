const pokemonContainer = document.getElementById("pokemon-cards");
const search = document.getElementById("search");
const typeSelect = document.getElementById("typeSearch");
const regionSelect = document.getElementById("regionSearch");
const baseURL = "https://pokeapi.co/api/v2/pokemon/";

// IDs ou nomes dos Pokémon que você quer exibir
const pokemonList = Array.from({ length: 251 }, (_, index) => index + 1);

search.addEventListener("input", (event) => {
  const searchValue = event.target.value.toLowerCase();

  const pokemons = document.querySelectorAll(".c-card__pokemon");

  pokemons.forEach((pokemon) => {
    const pokemonName = pokemon.querySelector(".c-card__info p:last-child").textContent.toLowerCase();
    const pokemonId = pokemon.querySelector(".c-card__info p").textContent.toLowerCase();
    if (pokemonName.includes(searchValue) || pokemonId.includes(searchValue)) {
      pokemon.style.display = "";
    } else {
      pokemon.style.display = "none";
    }
  });
});

typeSelect.addEventListener("change", (event) => {
  const selectValue = event.target.value.toLowerCase();

  const pokemons = document.querySelectorAll(".c-card__pokemon");

  pokemons.forEach((pokemon) => {
    // Seleciona todos os elementos dentro de ".type" que contêm o tipo
    const pokemonTypes = Array.from(pokemon.querySelectorAll(".type p"))
      .map(type => type.textContent.toLowerCase()); // Obtém o texto e converte para minúsculas

    // Exibe o Pokémon se ele for do tipo selecionado ou se "All" estiver selecionado
    if (pokemonTypes.includes(selectValue) || selectValue === "all") {
      pokemon.style.display = "";
    } else {
      pokemon.style.display = "none";
    }
  });
});

regionSelect.addEventListener("change", (event) => {
  const selectValue = event.target.value.toLowerCase();
  const pokemons = document.querySelectorAll(".c-card__pokemon");

  pokemons.forEach((pokemon) => {
    const pokemonId = pokemon.querySelector(".c-card__info p").textContent.toLowerCase();
    const region = getRegion(pokemonId);

    if (region === selectValue || selectValue === "all") {
      pokemon.style.display = "";
    } else {
      pokemon.style.display = "none";
    }
  });
});

// Criar um card para o Pokémon
const typeColors = {
  grass: "#3FA129",
  fire: "#FF8000",
  water: "#2980EF",
  bug: "#91A119",
  normal: "#9FA19F",
  poison: "#9141CB",
  electric: "#F5C632",
  ground: "#915121",
  fairy: "#EF70EF",
  fighting: "#E62829",
  psychic: "#EF4179",
  rock: "#B0AA82",
  ghost: "#704170",
  ice: "#3FD8FF",
  dragon: "#5060E1",
  dark: "#4F3F3D",
  steel: "#60A1B8",
  flying: "#81B9EF",
};

// Criar um card para o Pokémon
const typeColorsHovers = {
  grass: "#82C274",
  fire: "#FFAC59",
  water: "#74ACF5",
  bug: "#B8C26A",
  normal: "#C1C2C1",
  poison: "#B884DD",
  electric: "#FCD659",
  ground: "#B88E6F",
  fairy: "#F5A2F5",
  fighting: "#EF7374",
  psychic: "#F584A8",
  rock: "#CBC7AD",
  ghost: "#A284A2",
  ice: "#81DFF7",
  dragon: "#8D98EC",
  dark: "#998B8C",
  steel: "#98C2D1",
  flying: "#ADD2F5",
};

async function fetchPokemonData(pokemonId) {
  try {
    const response = await fetch(`${baseURL}${pokemonId}`);
    const data = await response.json();


    const pokemonCard = `
      <div class="c-card__pokemon" style="--type-color:${typeColors[data.types[0].type.name]};">
      <div class="c-card__image">
        <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" />
      </div>
      <div class="c-card__info">
        <p class="m-0">#${data.id.toString().padStart(3, "0")}</p>
        <p class="m-0">${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</p>
      </div>
      <div class="c-card__type">
        ${data.types
        .map(
          (type) =>
            `<span class="type" style="--type-color:${typeColors[type.type.name]}; --type-color-hover:${typeColorsHovers[type.type.name]};"><img src="assets/img/${type.type.name} type icon.png"><p>${type.type.name}</p></span>`
        )
        .join(" ")}
      </div>
      </div>
    `;

    // Adicionar o card ao container
    pokemonContainer.innerHTML += pokemonCard;
  } catch (error) {
    console.error(`Erro ao buscar dados do Pokémon com ID ${pokemonId}:`, error);
  }
}

// Chamar a função para cada Pokémon da lista
pokemonList.forEach((pokemonId) => fetchPokemonData(pokemonId));
