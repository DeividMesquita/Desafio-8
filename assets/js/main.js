const pokemonContainer = document.getElementById("pokemon-cards");
const baseURL = "https://pokeapi.co/api/v2/pokemon/";

// IDs ou nomes dos Pokémon que você quer exibir
const pokemonList = Array.from({ length: 18 }, (_, index) => index + 1);

async function fetchPokemonData(pokemonId) {
  try {
    const response = await fetch(`${baseURL}${pokemonId}`);
    const data = await response.json();

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

    const pokemonCard = `
      <div class="c-card__pokemon col-2">
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
                `<span class="type" style="color: ${typeColors[type.type.name]};"><img src="assets/img/${type.type.name} type icon.png" style="color: ${typeColors[type.type.name]};">${type.type.name}</span>`
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
