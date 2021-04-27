const pokedexSection = document.querySelector('[data-pokedex]')

// Get data from pokemons
async function getData(number) {
  const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}/`)
  const data = await pokemonData.json()
  return data
}

async function init() {
  let pokemons = []

  for (let i = 1; i <=151; i++) {
    let data = await getData(i)

    let types = data.types.map(el => el.type.name)

    pokemons.push(`
      <article class="${types.join(' ')}">
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <h2 class="pokemon_name">${data.name}</h2>
        <span>Type: ${types.join(' | ')}</span>
      </article>
    `)
  }

  pokedexSection.innerHTML = pokemons.join('')
}

init()