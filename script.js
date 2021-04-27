const pokedexSection = document.querySelector('[data-pokedex]')

// Get data from pokemons
async function getData(number) {
  const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}/`)
  const data = await pokemonData.json()
  return data
}

async function init() {
  let pokemons = []

  for (let i = 1; i <=10; i++) {
    let data = await getData(i)
    pokemons.push(data)
  }

  console.log(pokemons)
  return pokemons
}

init()