const home = document.getElementById("home");
const pokemonContainer = document.getElementById("pokemon-cards");
const modal = document.getElementById("pokemonModal");
const search = document.getElementById("search");
const fav = document.getElementById("pokeFavorites");
const typeSelect = document.getElementById("typeSearch");
const regionSelect = document.getElementById("regionSearch");
const continueButton = document.getElementById("continueButton");
const baseURL = "https://pokeapi.co/api/v2/pokemon/";
const favoritePokemons = new Set(JSON.parse(localStorage.getItem("favorites")) || []);
const regionCache = {}; // Cache para evitar requisições repetidas
const allPokemons = [];

// Lista de IDs dos Pokémon que você quer exibir
let pokemonList = Array.from({ length: 18 }, (_, index) => index + 1);

function getTypeColors() {
  return {
    grass: "#3FA129", fire: "#FF8000", water: "#2980EF", bug: "#91A119",
    normal: "#9FA19F", poison: "#9141CB", electric: "#F5C632", ground: "#915121",
    fairy: "#EF70EF", fighting: "#E62829", psychic: "#EF4179", rock: "#B0AA82",
    ghost: "#704170", ice: "#3FD8FF", dragon: "#5060E1", dark: "#4F3F3D",
    steel: "#60A1B8", flying: "#81B9EF"
  };
}

function getTypeColorsHovers() {
  return {
    grass: "#82C274", fire: "#FFAC59", water: "#74ACF5", bug: "#B8C26A",
    normal: "#C1C2C1", poison: "#B884DD", electric: "#FCD659", ground: "#B88E6F",
    fairy: "#F5A2F5", fighting: "#EF7374", psychic: "#F584A8", rock: "#CBC7AD",
    ghost: "#A284A2", ice: "#81DFF7", dragon: "#8D98EC", dark: "#998B8C",
    steel: "#98C2D1", flying: "#ADD2F5"
  };
}

const typeColors = getTypeColors();
const typeColorsHovers = getTypeColorsHovers();

// Função para buscar a região de um Pokémon
async function fetchRegion(pokemonId) {
  // Verifica se a região do Pokémon já está no cache
  if (regionCache[pokemonId]) return regionCache[pokemonId];

  try {
    // Faz uma requisição para obter os dados da espécie do Pokémon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const data = await response.json();

    // Faz uma requisição para obter os dados da geração do Pokémon
    const generationResponse = await fetch(data.generation.url);
    const generationData = await generationResponse.json();

    // Obtém o nome da região principal da geração e converte para minúsculas
    const region = generationData.main_region.name.toLowerCase();

    // Armazena a região no cache para futuras consultas
    regionCache[pokemonId] = region;
    return region;
  } catch (error) {
    console.error("Erro ao buscar região:", error);
    return "unknown";
  }
}

// Mapeamento de IDs para nomes corrigidos
const correctedNames = {
  29: "Nidoran ♀",
  32: "Nidoran ♂",
  83: "Farfetch'd",
  122: "Mr. Mime",
  250: "Ho-Oh",
  386: "Deoxys",
  413: "Wormadam",
  439: "Mime Jr.",
  474: "Porygon-Z",
  487: "Giratina",
  492: "Shaymin",
  550: "Basculin",
  555: "Darmanitan",
  641: "Tornadus",
  642: "Thundurus",
  645: "Landorus",
  647: "Keldeo",
  648: "Meloetta",
  669: "Flabébé",
  678: "Meowstic",
  681: "Aegislash",
  710: "Pumpkaboo",
  711: "Gourgeist",
  718: "Zygarde",
  741: "Oricorio",
  745: "Lycanroc",
  746: "Wishiwashi",
  772: "Type: Null",
  774: "Minior",
  778: "Mimikyu",
  785: "Tapu Koko",
  786: "Tapu Lele",
  787: "Tapu Bulu",
  788: "Tapu Fini",
  849: "Toxtricity",
  865: "Sirfetch'd",
  866: "Mr. Rime",
  875: "Eiscue",
  876: "Indeedee",
  877: "Morpeko",
  892: "Urshifu",
  902: "Basculegion",
  905: "Enamorus",
  916: "Oinkologne",
  925: "Maushold",
  931: "Squawkabilly",
  964: "Palafin",
  978: "Tatsugiri",
  982: "Dudunsparce",
  984: "Great Tusk",
  985: "Scream Tail",
  986: "Brute Bonnet",
  987: "Flutter Mane",
  988: "Slither Wing",
  989: "Sandy Shocks",
  990: "Iron Treads",
  991: "Iron Bundle",
  992: "Iron Hands",
  993: "Iron Jugulis",
  994: "Iron Moth",
  995: "Iron Thorns",
  1001: "Wo-Chien",
  1002: "Chien-Pao",
  1003: "Ting-Lu",
  1004: "Chi-Yu",
  1005: "Roaring Moon",
  1006: "Iron Valiant",
  1009: "Walking Wake",
  1010: "Iron Leaves",
  1020: "Gouging Fire",
  1021: "Raging Bolt",
  1022: "Iron Boulder",
  1023: "Iron Crown"
};

// Função para buscar os dados de um Pokémon
async function fetchPokemonData(pokemonId, index) {
  try {
    // Faz uma requisição para obter os dados do Pokémon
    const response = await fetch(`${baseURL}${pokemonId}`);
    const data = await response.json();

    // Busca a região do Pokémon
    const region = await fetchRegion(pokemonId);

    // Armazena o Pokémon na posição correta do array allPokemons
    allPokemons[index] = {
      id: data.id,
      name: correctedNames[data.id] || data.name, // Usa o nome corrigido se disponível
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
  // Renderiza cada card de Pokémon
  pokemons.forEach(pokemon => {
    const isFavorite = favoritePokemons.has(pokemon.id);
    const pokemonCard = `
      <div class="c-card__pokemon" style="--type-color:${typeColors[pokemon.types[0]]};">
      <div class="l-card__favorite">
        <i class="fa-${isFavorite ? "solid" : "regular"} fa-heart" onclick="toggleFavorite(${pokemon.id}, this)"></i>
      </div>
      <div class="c-card__content">
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
          <img src="https://deividmesquita.github.io/Desafio-8/assets/img/${type}-type-icon.png">
          <p>${type}</p>
        </span>`).join(" ")}
      </div>
      </div>
      </div>`;
    pokemonContainer.innerHTML += pokemonCard;
  });
}

// função para logica do modal
function modalPokemon(pokemon) {
  if (!pokemon) return;

  // const para favoritar os pokemons e poder fazer o filtro
  const isFavorite = favoritePokemons.has(pokemon.id);
  // const para o modal
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
          <i class="fav-modal fa-${isFavorite ? "solid" : "regular"} fa-heart" onclick="toggleFavorite(${pokemon.id}, this); updateCardFavorite(${pokemon.id}, this)"></i>
        </div>
          <div class="l-modal__types">
          <p class="m-0">Type</p>
          <div class="l-modal__type--container">
          ${pokemon.types.map((type) => `
            <span class="l-modal__type" style="--type-color:${typeColors[type]}; --type-color-hover:${typeColorsHovers[type]};">
              <img src="https://deividmesquita.github.io/Desafio-8/assets/img/${type}-type-icon.png">
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

  // const para o modal e mostrar na tela com o display block
  const modal = document.getElementById("pokemonModal");
  modal.innerHTML = modalContent;
  modal.style.display = "block";
}



// Função para fechar o modal
function closeModal() {
  document.getElementById("pokemonModal").style.display = "none";
}

// Função para abrir o modal ao clicar no card
function setupCardClickEvent() {
  pokemonContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".c-card__content");
    if (card) {
      // Pega o ID do Pokémon clicado
      const pokemonId = parseInt(card.querySelector(".c-card__info p").textContent.replace("#", ""));
      // Pega o Pokémon com o ID clicado
      const pokemon = allPokemons.find(p => p.id === pokemonId);
      // Chama a função para abrir o modal com os dados do Pokémon
      if (pokemon) {
        modalPokemon(pokemon);
      }
    }
  });
}

// Chama a função para configurar o evento de clique nos cards
setupCardClickEvent();

function returnToHome() {
  home.addEventListener("click", () => {
    renderPokemonCards(allPokemons.slice(0, 18));
    document.getElementById("continueButton").classList.remove("d-none");
  });
}

returnToHome();

// Função de busca por nome ou ID
function setupSearchEvent() {
  search.addEventListener("input", (event) => {
    const searchValue = event.target.value.toLowerCase();

    // Se o campo de busca estiver vazio, exibe todos os Pokémon
    if (searchValue === "") {
      document.querySelectorAll(".c-card__pokemon").forEach((pokemon) => {
        pokemon.style.display = "";
      });
      document.getElementById("notFoundMessage")?.remove();
      return;
    }

    let found = false;

    document.querySelectorAll(".c-card__pokemon").forEach((pokemon) => {
      const pokemonName = pokemon.querySelector(".c-card__info p:last-child").textContent.toLowerCase();
      const pokemonId = pokemon.querySelector(".c-card__info p").textContent.replace("#", "").toLowerCase();

      if (pokemonName.includes(searchValue) || pokemonId.includes(searchValue)) {
        pokemon.style.display = "";
        found = true;
      } else {
        pokemon.style.display = "none";
      }
    });

    // Remove a mensagem antiga antes de adicionar uma nova
    document.getElementById("notFoundMessage")?.remove();

    if (!found) {
      const message = document.createElement("div");
      message.id = "notFoundMessage";
      message.className = "not-Found";
      message.innerHTML = `<p>Pokémon com nome ou ID "${searchValue}" não encontrado.</p>`;
      pokemonContainer.appendChild(message);
    }
  });
}

// Chama a função para configurar o evento de busca
setupSearchEvent();


// Função para filtrar os Pokémon por região e tipo
async function filterPokemonsByRegionAndType() {
  const regionValue = regionSelect.value.toLowerCase();
  const typeValue = typeSelect.value.toLowerCase();

  let filteredPokemons;

  if (regionValue === "all") {
    filteredPokemons = allPokemons.slice().sort((a, b) => a.id - b.id);
  } else {
    // Filtra os Pokémon pela região selecionada
    filteredPokemons = allPokemons.filter(pokemon => pokemon.region === regionValue);
  }

  // Se a quantidade de Pokémon da região for menor que o esperado, carregamos mais
  let expectedCount = 0;
  let regionPokemons = [];

  if (regionValue === "kanto") {
    expectedCount = 151;
    regionPokemons = Array.from({ length: 151 }, (_, index) => index + 1);
    allPokemons.splice(0, 18); // Remove os primeiros 18 Pokémon carregados
  } else if (regionValue === "johto") {
    expectedCount = 100;
    regionPokemons = Array.from({ length: 100 }, (_, index) => index + 152);
  } else if (regionValue === "hoenn") {
    expectedCount = 135;
    regionPokemons = Array.from({ length: 135 }, (_, index) => index + 252);
  } else if (regionValue === "sinnoh") {
    expectedCount = 107;
    regionPokemons = Array.from({ length: 107 }, (_, index) => index + 387);
  } else if (regionValue === "unova") {
    expectedCount = 156;
    regionPokemons = Array.from({ length: 156 }, (_, index) => index + 495);
  } else if (regionValue === "kalos") {
    expectedCount = 72;
    regionPokemons = Array.from({ length: 72 }, (_, index) => index + 650);
  } else if (regionValue === "alola") {
    expectedCount = 88;
    regionPokemons = Array.from({ length: 88 }, (_, index) => index + 722);
  } else if (regionValue === "galar") {
    expectedCount = 97;
    regionPokemons = Array.from({ length: 97 }, (_, index) => index + 810);
  } else if (regionValue === "paldea") {
    expectedCount = 120;
    regionPokemons = Array.from({ length: 120 }, (_, index) => index + 906);
  }

  if (filteredPokemons.length < expectedCount) {
    await Promise.all(regionPokemons.map((pokemonId, index) => fetchPokemonData(pokemonId, allPokemons.length + index)));
    filteredPokemons = allPokemons.filter(pokemon => pokemon.region === regionValue);
  }

  // Filtra os Pokémon pelo tipo selecionado
  if (typeValue !== "all") {
    filteredPokemons = filteredPokemons.filter(pokemon => pokemon.types.includes(typeValue));
  }

  // Renderiza os Pokémon filtrados
  renderPokemonCards(filteredPokemons);

  // Exibe mensagem se nenhum Pokémon for encontrado
  if (filteredPokemons.length === 0) {
    pokemonContainer.innerHTML = `<div class="not-Found"><p>Nenhum Pokémon encontrado para a região ${regionValue} e tipo ${typeValue}.</p><button class="l-pagination__btn" id="backButton">VOLTAR</button></div>`;
    document.getElementById("backButton").addEventListener("click", () => {
      renderPokemonCards(allPokemons.slice(0, 18));
      document.getElementById("continueButton").classList.remove("d-none");
    });
    document.getElementById("continueButton").classList.add("d-none");
  }
}

// Adiciona eventos de mudança nos selects de região e tipo
regionSelect.addEventListener("change", filterPokemonsByRegionAndType);
typeSelect.addEventListener("change", filterPokemonsByRegionAndType);

// Função para favoritar um Pokémon
function toggleFavorite(pokemonId, element) {
  // Verifica se o Pokémon já está favoritado
  if (favoritePokemons.has(pokemonId)) {
    // Se sim, remove da lista de favoritos
    favoritePokemons.delete(pokemonId);
    element.classList.replace("fa-solid", "fa-regular");
  } else {
    //  Se não, adiciona à lista de favoritos
    favoritePokemons.add(pokemonId);
    element.classList.replace("fa-regular", "fa-solid");
  }
  // Atualiza a lista de favoritos no localStorage
  localStorage.setItem("favorites", JSON.stringify([...favoritePokemons]));
  updateFavoriteIcons(pokemonId, element);
}

// Função para atualizar o ícone de favorito
function updateFavoriteIcons(pokemonId, element) {
  // Verifica se o Pokémon é favorito e atualiza o ícone
  const card = document.querySelector(`.c-card__pokemon .fa-heart[onclick="toggleFavorite(${pokemonId}, this)"]`);
  const modalFavIcon = document.querySelector(`.fav-modal[onclick="toggleFavorite(${pokemonId}, this); updateFavoriteIcons(${pokemonId}, this)"]`);

  // Verifica se o card e o modal estão presentes
  if (card) {
    if (favoritePokemons.has(pokemonId)) {
      card.classList.replace("fa-regular", "fa-solid");
    } else {
      card.classList.replace("fa-solid", "fa-regular");
    }
  }

  // Verifica se o modal está presente
  if (modalFavIcon) {
    if (favoritePokemons.has(pokemonId)) {
      modalFavIcon.classList.replace("fa-regular", "fa-solid");
    } else {
      modalFavIcon.classList.replace("fa-solid", "fa-regular");
    }
  }
}

// Função para mostrar apenas os Pokémon favoritos
function setupFavoriteFilterEvent() {
  // Adiciona um evento de click no botão de favoritos
  fav.addEventListener("click", async () => {
    // Verifica se existem Pokémon favoritos em uma lista
    const favoritePokemonList = [];
    // Para cada ID de Pokémon favorito, busca o Pokémon correspondente
    for (const pokemonId of favoritePokemons) {
      const pokemon = allPokemons.find(p => p.id === pokemonId);
      if (pokemon) {
        favoritePokemonList.push(pokemon);
      } else {
        await fetchPokemonData(pokemonId, allPokemons.length);
        favoritePokemonList.push(allPokemons.find(p => p.id === pokemonId));
      }
    }
    if (favoritePokemonList.length === 0) {
      pokemonContainer.innerHTML = '<div class="not-Found"><p>Nenhum Pokemon favoritado.</p><button class="l-pagination__btn" id="backButton">VOLTAR</button></div>';
      document.getElementById("backButton").addEventListener("click", () => {
        renderPokemonCards(allPokemons.slice(0, 18));
        document.getElementById("continueButton").classList.remove("d-none");
      });
      document.getElementById("continueButton").classList.add("d-none");
    } else {
      renderPokemonCards(favoritePokemonList);
    }
  });
}

// Chama a função para configurar o evento de filtro por favoritos
setupFavoriteFilterEvent();



// Função para configurar o evento do botão continuar
function setupContinueButtonEvent() {
  // Adiciona um evento de click no botão continuar
  continueButton.addEventListener("click", () => {
    const currentLength = pokemonList.length;
    // Adiciona mais 18 Pokémon à lista
    const newPokemonList = [];
    for (let i = 0; i < 18; i++) {
      newPokemonList.push(currentLength + i + 1);
    }
    // Adiciona os novos Pokémon à lista e carrega os dados
    pokemonList.push(...newPokemonList);
    Promise.all(pokemonList.map((pokemonId, index) => fetchPokemonData(pokemonId, index)))
  });
}

// Chama a função para configurar o evento do botão continuar
setupContinueButtonEvent();

// Carrega todos os Pokémon
Promise.all(pokemonList.map((pokemonId, index) => fetchPokemonData(pokemonId, index)));
