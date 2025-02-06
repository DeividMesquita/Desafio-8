const pokemonContainer = document.getElementById("pokemon-cards");
const modal = document.getElementById("pokemonModal");
const search = document.getElementById("search");
const typeSelect = document.getElementById("typeSearch");
const regionSelect = document.getElementById("regionSearch");
const continueButton = document.getElementById("continueButton");
const baseURL = "https://pokeapi.co/api/v2/pokemon/";
const regionCache = {}; // Cache para evitar requisições repetidas
const allPokemons = [];

// Lista de IDs dos Pokémon que você quer exibir
const pokemonList = Array.from({ length: 18 }, (_, index) => index + 1);

// Cores dos tipos
const typeColors = {
  grass: "#3FA129", fire: "#FF8000", water: "#2980EF", bug: "#91A119",
  normal: "#9FA19F", poison: "#9141CB", electric: "#F5C632", ground: "#915121",
  fairy: "#EF70EF", fighting: "#E62829", psychic: "#EF4179", rock: "#B0AA82",
  ghost: "#704170", ice: "#3FD8FF", dragon: "#5060E1", dark: "#4F3F3D",
  steel: "#60A1B8", flying: "#81B9EF"
};

const typeColorsHovers = {
  grass: "#82C274", fire: "#FFAC59", water: "#74ACF5", bug: "#B8C26A",
  normal: "#C1C2C1", poison: "#B884DD", electric: "#FCD659", ground: "#B88E6F",
  fairy: "#F5A2F5", fighting: "#EF7374", psychic: "#F584A8", rock: "#CBC7AD",
  ghost: "#A284A2", ice: "#81DFF7", dragon: "#8D98EC", dark: "#998B8C",
  steel: "#98C2D1", flying: "#ADD2F5"
};

// Função para buscar a região de um Pokémon
async function fetchRegion(pokemonId) {
  if (regionCache[pokemonId]) return regionCache[pokemonId];

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const data = await response.json();
    const generationResponse = await fetch(data.generation.url);
    const generationData = await generationResponse.json();
    const region = generationData.main_region.name.toLowerCase();

    regionCache[pokemonId] = region;
    return region;
  } catch (error) {
    console.error("Erro ao buscar região:", error);
    return "unknown";
  }
}

// Função para buscar os dados de um Pokémon
async function fetchPokemonData(pokemonId, index) {
  try {
    const response = await fetch(`${baseURL}${pokemonId}`);
    const data = await response.json();

    // Busca a região do Pokémon
    const region = await fetchRegion(pokemonId);

    // Armazena o Pokémon na posição correta do array allPokemons
    allPokemons[index] = {
      id: data.id,
      name: data.name,
      region: region,
      types: data.types.map(type => type.type.name),
      height: (data.height / 10).toFixed(1) + " m",
      weight: (data.weight / 10).toFixed(1) + " kg",
      baseExperience: data.base_experience,
      abilities: data.abilities.map(a => a.ability.name) // Pegando os nomes das habilidades
    };

    // Verifica se todos os Pokémon foram carregados para renderizar
    if (allPokemons.filter(pokemon => pokemon).length === pokemonList.length) {
      renderPokemonCards(allPokemons);
    }
  } catch (error) {
    console.error(`Erro ao buscar dados do Pokémon com ID ${pokemonId}:`, error);
  }
}


// Função para renderizar todos os cards de Pokémon
function renderPokemonCards(pokemons) {
  pokemonContainer.innerHTML = ""; // Limpa o container
  pokemons.forEach(pokemon => {
    const pokemonCard = `
      <div class="c-card__pokemon" style="--type-color:${typeColors[pokemon.types[0]]};">
        <div class="c-card__image">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}" />
        </div>
        <div class="c-card__info">
          <p class="m-0">#${pokemon.id.toString().padStart(3, "0")}</p>
          <p class="m-0">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
        </div>
        <div class="c-card__type">
          ${pokemon.types.map((type) => `
            <span class="type" style="--type-color:${typeColors[type]}; --type-color-hover:${typeColorsHovers[type]};">
              <img src="/assets/img/${type} type icon.png">
              <p>${type}</p>
            </span>`).join(" ")}
        </div>
      </div>`;
    pokemonContainer.innerHTML += pokemonCard;
  });
}

function modalPokemon(pokemon) {
  if (!pokemon) return;

  console.log("Objeto Pokémon recebido:", pokemon); // Verifica o objeto completo
  console.log("Abilities recebidas:", pokemon.abilities); // Verifica se a chave abilities está presente

  // Verifica se 'abilities' existem e são arrays
  const abilities = Array.isArray(pokemon.abilities)
    ? pokemon.abilities.map(a => {
      console.log("Verificando habilidade:", a); // Verifica cada item
      return a?.ability?.name || "Unknown";
    })
    : [];

  console.log("Habilidades formatadas:", abilities.join(", ")); // Verifica o resultado final

  const modalContent = `
    <div class="c-modal__box">
      <span class="l-modal__close" onclick="closeModal()"><i class="fa-solid fa-x fa-sm" style="color: #ffffff;"></i></i></span>
      <div class="l-modal__content">
        <div class="l-modal__img">
          <figure>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}" />
          </figure>
        </div>
        <div class="l-modal__info">
        <div class="l-modal__tag">
          <p class="m-0" id="pokemonNumber" style="--type-color:${typeColors[pokemon.types[0]]};">#${pokemon.id.toString().padStart(3, "0")}</p>
          <p class="m-0" id="pokemonName">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
        </div>
          <div class="l-modal__types">
          <p class="m-0">Type</p>
          <div class="l-modal__type--container">
          ${pokemon.types.map((type) => `
            <span class="l-modal__type" style="--type-color:${typeColors[type]}; --type-color-hover:${typeColorsHovers[type]};">
              <img src="/assets/img/${type} type icon.png">
              <p>${type}</p>
            </span>`).join(" ")}
            </div>
          </div>
          <div class="l-modal__caracteristics">
            <div class="l-modal__caracteristics--item">
              <p>Height</p>
              <p>${pokemon.height}</p>
            </div>
            <div class="l-modal__caracteristics--item">
              <p >Weight</p>
              <p >${pokemon.weight}</p>
            </div>
            <div class="l-modal__caracteristics--item">
              <p >Base EXP.</p>
              <p >${pokemon.baseExperience}</p>
            </div>
          </div>
          <div class="l-modal__abilities">
            <p class="m-0">Abilities</p>

            <div class="l-modal__ability" id="pokemonAbilities">
              ${pokemon.abilities.map(ability => `<p>${ability}</p>`).join(" ")}
            </div>
          </div>
        </div>
      </div>
    </div>`;

  const modal = document.getElementById("pokemonModal");
  modal.innerHTML = modalContent;
  modal.style.display = "block";
}



// Função para fechar o modal
function closeModal() {
  document.getElementById("pokemonModal").style.display = "none";
}

// Evento para abrir o modal ao clicar no card
pokemonContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".c-card__pokemon");
  if (card) {
    const pokemonId = parseInt(card.querySelector(".c-card__info p").textContent.replace("#", ""));
    const pokemon = allPokemons.find(p => p.id === pokemonId);
    if (pokemon) {
      modalPokemon(pokemon);
    }
  }
});

// Evento de busca por nome ou ID
search.addEventListener("input", (event) => {

  const searchValue = event.target.value.toLowerCase();

  document.querySelectorAll(".c-card__pokemon").forEach((pokemon) => {

    const pokemonName = pokemon.querySelector(".c-card__info p:last-child").textContent.toLowerCase();

    const pokemonId = pokemon.querySelector(".c-card__info p").textContent.replace("#", "").toLowerCase();

    if (pokemonName.includes(searchValue) || pokemonId.includes(searchValue)) {
      pokemon.style.display = "";
    } else {
      pokemon.style.display = "none";
    }
  });
});


// Evento de filtro por tipo
typeSelect.addEventListener("change", (event) => {

  const selectValue = event.target.value.toLowerCase();

  document.querySelectorAll(".c-card__pokemon").forEach((pokemon) => {

    const pokemonTypes = Array.from(pokemon.querySelectorAll(".type p")).map(type => type.textContent.toLowerCase());

    if (pokemonTypes.includes(selectValue) || selectValue === "all") {
      pokemon.style.display = "";
    } else {
      pokemon.style.display = "none";
    }
  });
});


// Evento de filtro por região
regionSelect.addEventListener("change", (event) => {
  const selectValue = event.target.value.toLowerCase();


  const filteredPokemons = selectValue === "all" ? allPokemons : allPokemons.filter(pokemon => {
    console.log(`Pokémon: ${pokemon.name}, Região: ${pokemon.region}`);
    return pokemon.region === selectValue;
  });

  renderPokemonCards(filteredPokemons);
});

continueButton.addEventListener("click", () => {
  const currentLength = pokemonList.length;
  const newPokemonList = [];
  for (let i = 0; i < 18; i++) {
    newPokemonList.push(currentLength + i + 1);
  }
  pokemonList.push(...newPokemonList);
  Promise.all(pokemonList.map((pokemonId, index) => fetchPokemonData(pokemonId, index)))
    .then(() => {
      console.log("Todos os Pokémon foram carregados!");
    });
});

// Carrega todos os Pokémon
Promise.all(pokemonList.map((pokemonId, index) => fetchPokemonData(pokemonId, index)))
  .then(() => {
    console.log("Todos os Pokémon foram carregados!");
  });
