
let currentOffset = 0;                           //number of pokemons from 0
const limit = 20;                                //numbere of pokemons per request/show more


async function fetchDataJson() {
    showLoading(true);
    document.getElementById('content').innerHTML = '';
    
    for (let i = currentOffset + 1; i <= currentOffset + limit; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const pokemon = await response.json();
        document.getElementById('content').innerHTML += createPokemonCard(pokemon);
    }
    
    currentOffset += limit;
    showLoading(false);
}



async function loadMore() {
    showLoading(true);
 
    const startId = currentOffset + 1;
    const endId = currentOffset + limit;
 
    for (let i = startId; i <= endId; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const pokemon = await response.json();
        document.getElementById('content').innerHTML += createPokemonCard(pokemon);
    }
 
    currentOffset += limit;

    await new Promise(resolve => setTimeout(resolve, 1000));                           // 1 second delay before hiding loadingSpinner
    showLoading(false);
}



async function navigatePokemon(currentId, direction) {

    let newId;
    if(direction === 'prev') {
        newId = currentId - 1;
    } else {
        newId = currentId + 1;
    }

    showLoading(true);

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${newId}`);
    const pokemon = await response.json();

    document.getElementById('pokemonModal').innerHTML = createPokemonModal(pokemon);

    showLoading(false);
}



async function searchPokemonByName(element) {
    const searchText = element.value.toLowerCase();                  //using LowerCase to make our search easier to find

    if (searchText.length < 3) {                                      
        if (searchText.length === 0) {
            currentOffset = 0; 
            document.getElementById('content').innerHTML = '';
            fetchDataJson();
        }
        return;
    }

    showLoading(true);
    document.getElementById('content').innerHTML = '';


    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');       //get all pokemons
    const data = await response.json();

    
    const filteredPokemon = data.results.filter(pokemon =>                   //filter pokemon search
        pokemon.name.toLowerCase().includes(searchText)
    );


    if (filteredPokemon.length === 0) {                                       //when we found no pokemon
        document.getElementById('content').innerHTML = 'No Pokemon found!';
        showLoading(false);
        return;
    }

    for (let i = 0; i < Math.min(10, filteredPokemon.length); i++) {           //first 10 filter pokemon
        const pokemonResponse = await fetch(filteredPokemon[i].url);
        const pokemon = await pokemonResponse.json();
        document.getElementById('content').innerHTML += createPokemonCard(pokemon);
    }

    showLoading(false);
}



async function showPokemonDetails(id) {
    showLoading(true);
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();
    
    document.getElementById('pokemonModal').innerHTML = createPokemonModal(pokemon);
    document.getElementById('pokemonModal').style.display = 'block';
    
    showLoading(false);
}



function switchTab(tabName, event) {
    
    const tabs = document.getElementsByClassName('tab');
    for(let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    
    event.target.classList.add('active');
    
    
    document.getElementById('mainTab').style.display = 'none';
    document.getElementById('statsTab').style.display = 'none';
    document.getElementById('evoChainTab').style.display = 'none';
    
    
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    
    if (tabName === 'evoChain') {
        const modalContent = document.getElementsByClassName('modal-content')[0];
        const pokemonId = modalContent.dataset.pokemonId;
        updateEvolutionChain(pokemonId);
    }
}



async function updateEvolutionChain(pokemonId) {
    document.getElementById('evolution-chain').innerHTML = 'Loading...';
 
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const species = await speciesResponse.json();
    
    const evolutionResponse = await fetch(species.evolution_chain.url);
    const evolution = await evolutionResponse.json();
 
    let chain = [];
    let currentPokemon = evolution.chain;
 
    while (currentPokemon) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemon.species.name}`);
        const pokemon = await response.json();
        
        chain.push({
            name: pokemon.species.name,
            image: pokemon.sprites.other['official-artwork'].front_default
        });
 
        currentPokemon = currentPokemon.evolves_to[0];
    }
 
    document.getElementById('evolution-chain').innerHTML = createEvolutionChainHTML(chain);
}



function closeModal() {
    document.getElementById('pokemonModal').style.display = 'none';
    if (document.getElementById('searchInput').value.length > 0) {
        document.getElementById('loadMore').style.display = 'none';
    }
}



function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
    
    if (document.getElementById('searchInput').value.length > 0) {
        document.getElementById('loadMore').style.display = 'none';
    } else {
        document.getElementById('loadMore').style.display = show ? 'none' : 'block';
    }
}