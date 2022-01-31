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

function getPokemonsPromisesData(quantity = 151) {
  if (quantity > 151 || quantity < 0) {
    throw new Error("Pokemons quantity must to be between 1 and 151")
  }
  let pokemonPromisesData = []
  for (let i = 1; i <= quantity; i++) {
    pokemonPromisesData.push(fetchPokemonDataPromise(i))
  }
  return pokemonPromisesData
}

function sortPokemonsArray(pokemons) {
  return pokemons.sort(function (a, b) {
    if (a.id < a.id) return -1
    if (a.id > b.id) return 1
    return 0
  })
}

async function resolveArrayOfPromises(promises) {
  return await Promise.all(promises.map(async data => {
    const pokemonData = await data.json()
    return parsePokemonData(pokemonData)
  }))
}

async function init() {
  const pokemonsDataPromises = await Promise.all(getPokemonsPromisesData(151))
  const pokemons = await resolveArrayOfPromises(pokemonsDataPromises)
  const pokemonsSorted = sortPokemonsArray(pokemons)
  pokedexSection.innerHTML = pokemonsSorted.reduce((acc, cur) => acc + pokemonCompoment(cur), '')
}

init()