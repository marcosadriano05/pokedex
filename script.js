const pokedexSection = document.querySelector('[data-pokedex]')

function parsePokemonData(pokemonData) {
  const id = pokemonData.id
  const name = pokemonData.name
  const types = pokemonData.types.map(({ type }) => type.name)
  const frontSprite = pokemonData.sprites.front_default

  return { id, name, types, frontSprite }
}

async function fetchPokemonDataPromise(number) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${number}/`)
}

function pokemonCompoment(pokemonData) {
  return `
    <article class="${pokemonData.types.join(' ')} data-index=${pokemonData.id}">
      <img src="${pokemonData.frontSprite}" alt="${pokemonData.name}">
      <h2 class="pokemon_name">${pokemonData.name}</h2>
      <span>Type: ${pokemonData.types.join(' | ')}</span>
    </article>
  `
}

async function init() {
  let pokemonPromisesData = []
  for (let i = 1; i <= 151; i++) {
    pokemonPromisesData.push(fetchPokemonDataPromise(i))
  }

  const pokemonsDataPromises = await Promise.all(pokemonPromisesData)
  
  const pokemons = await Promise.all(pokemonsDataPromises.map(async data => {
    const pokemonData = await data.json()
    return parsePokemonData(pokemonData)
  }))

  pokedexSection.innerHTML = ''
  const pokemonsSorted = pokemons.sort(function (a, b) {
    if (a.id < a.id) return -1
    if (a.id > b.id) return 1
    return 0
  })

  pokedexSection.innerHTML = pokemonsSorted.reduce((acc, cur) => acc + pokemonCompoment(cur), '')
}

init()