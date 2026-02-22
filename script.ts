import { Context, Data, Effect } from "effect";

class BusinessPokemonError extends Data.TaggedError("BusinessPokemonError")<{
  message: string;
}> {}

class FetchPokemonError extends Data.TaggedError("FetchPokemonError")<{
  message: string;
  error: unknown;
}> {}

class ConvertPokemonDataToJsonError
  extends Data.TaggedError("ConvertPokemonDataToJsonError")<{
    message: string;
    error: unknown;
  }> {}

type Species = {
  name: string;
  url: string;
};

type Type = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

type Sprites = {
  front_default: string;
};

type Pokemon = {
  id: number;
  name: string;
  species: Species;
  types: Type[];
  sprites: Sprites;
};

const fetchPokemonData = (
  n: number,
): Effect.Effect<
  Pokemon,
  FetchPokemonError | ConvertPokemonDataToJsonError | BusinessPokemonError
> => {
  if (n < 1 || n > 151) {
    return Effect.fail(
      new BusinessPokemonError({
        message: "The pokemon list is between 1 and 151",
      }),
    );
  }
  return Effect.tryPromise({
    try: () => fetch(`https://pokeapi.co/api/v2/pokemon/${n}/`),
    catch: (error) =>
      new FetchPokemonError({ message: `Erro to fetch pokemon ${n}`, error }),
  }).pipe(
    Effect.flatMap((result) =>
      Effect.tryPromise({
        try: () => result.json(),
        catch: (error) =>
          new ConvertPokemonDataToJsonError({
            message: `Error to convert result to json ${n}`,
            error,
          }),
      })
    ),
    Effect.delay("1 second"), // Only to see the concurrency in UI
  );
};

class RenderToDom extends Context.Tag("RenderToDom")<
  RenderToDom,
  { readonly render: (pokemon: Pokemon) => Effect.Effect<void> }
>() {}

const getPokemonsEffects = (
  quantity = 151,
): Effect.Effect<Pokemon, never, RenderToDom>[] => {
  const effects: Effect.Effect<Pokemon, never, RenderToDom>[] = Array.from({
    length: quantity,
  });
  for (let i = 0; i < effects.length; i++) {
    effects[i] = fetchPokemonData(i + 1).pipe(
      Effect.catchTag(
        "FetchPokemonError",
        (error) =>
          Effect.succeed({
            id: i + 1,
            name: "",
            species: { name: error.message, url: "" },
            types: [],
            sprites: { front_default: "" },
          }),
      ),
      Effect.catchTag(
        "ConvertPokemonDataToJsonError",
        (error) =>
          Effect.succeed({
            id: i + 1,
            name: "",
            species: { name: error.message, url: "" },
            types: [],
            sprites: { front_default: "" },
          }),
      ),
      Effect.catchTag(
        "BusinessPokemonError",
        (error) =>
          Effect.succeed({
            id: i + 1,
            name: "",
            species: { name: error.message, url: "" },
            types: [],
            sprites: { front_default: "" },
          }),
      ),
      Effect.tap((result) =>
        RenderToDom.pipe(Effect.andThen((render) => render.render(result)))
      ),
    );
  }
  return effects;
};

const getPokemonsEffectsImpl = (
  n = 151,
): Effect.Effect<Pokemon[]> =>
  Effect.all(getPokemonsEffects(n), {
    concurrency: 3,
  }).pipe(
    Effect.provideService(
      RenderToDom,
      {
        render: (pokemon) => {
          const article = document.querySelector(
            `[data-index="${pokemon.id}"]`,
          );
          pokemon.types.forEach((t) => {
            article!.classList.add(t.type.name);
          });
          article!.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2 class="pokemon_name">${pokemon.name}</h2>
            <span>Type: ${
            pokemon.types.map((t) => t.type.name).join(" | ")
          }</span>
          `;
          return Effect.void;
          // return Console.log(`Pokemon: ${pokemon.name}`);
        },
      },
    ),
  );

const program = Effect.gen(function* () {
  const result = yield* getPokemonsEffectsImpl(151);
  return result.map((r) => r.species.name);
});

const pokedexSection = document.querySelector("[data-pokedex]");
if (pokedexSection != undefined) {
  for (let i = 0; i < 151; i++) {
    pokedexSection!.innerHTML += `
      <article data-index="${i + 1}">
        <p>Loading</p>
      </article>
    `;
  }
}

Effect.runPromise(program);
