const pokedexSection = document.querySelector('[data-pokedex]')

async function getPokemonData(number) {
  const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}/`)
  const data = await pokemonData.json()
  return data
}

async function getResolvedData(pokemonPromisesData) {
  let pokemonData = []
  for (let i = 0; i < pokemonPromisesData.length; i++) {
    pokemonData.push(await pokemonPromisesData[i])
  }
  return pokemonData
}

function getDOMstructure(acc, cur) {
  let types = cur.types.map(({ type }) => type.name)

  return acc + `
    <article class="${types.join(' ')}">
      <img src="${cur.sprites.front_default}" alt="${cur.name}">
      <h2 class="pokemon_name">${cur.name}</h2>
      <span>Type: ${types.join(' | ')}</span>
    </article>
  `
}

async function init() {
  let pokemonPromisesData = []
  for (let i = 1; i <= 151; i++) {
    pokemonPromisesData.push(getPokemonData(i))
  }

  const pokemonData = await getResolvedData(pokemonPromisesData)

  pokedexSection.innerHTML = pokemonData.reduce(getDOMstructure, '')
}

init()