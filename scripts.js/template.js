

function createPokemonCard(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const typeIcons = pokemon.types.map(type => `
        <img src="./img/pokedex_icons/typeIcon_${type.type.name}.png" class="type-icon" alt="${type.type.name}">
    `).join('');

    return `
        <div class="pokemon-card" data-type="${mainType}" onclick="showPokemonDetails(${pokemon.id})">
            <div class="card-bg">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            </div>
            <div class="card-info">
                <div class="card-header">
                    <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
                    <h3 class="pokemon-name">${pokemon.name}</h3>
                </div>
                <div class="type-icons">
                    ${typeIcons}
                </div>
            </div>
        </div>
    `;
}


function createPokemonModal(pokemon) {
    const mainType = pokemon.types[0].type.name;

    return `
        <div class="modal-content modal-dark" data-pokemon-id="${pokemon.id}" onclick="event.stopPropagation()">
            <div class="modal-navigation">
               ${pokemon.id > 1 ? `<button class="nav-btn prev-btn" onclick="navigatePokemon(${pokemon.id},'prev')">&lt;</button>` : ''}

                <div class="modal-pokemon-info">
                    <div class="pokemon-number">#${String(pokemon.id).padStart(3, '0')}</div>
                    <div class="pokemon-name">${pokemon.name}</div>
                </div>
                <button class="nav-btn next-btn" onclick="navigatePokemon(${pokemon.id},'next')">&gt;</button>
            </div>

            <div class="modal-pokemon-display">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" class="pokemon-image">
            </div>

            <div class="type-indicator">
                ${pokemon.types.map(type => `
                    <img src="./img/pokedex_icons/typeIcon_${type.type.name}.png" class="type-icon" alt="${type.type.name}">
                `).join('')}
            </div>

            <div class="modal-tabs">
                <button class="tab active" onclick="switchTab('main', event)">main</button>
                <button class="tab" onclick="switchTab('stats', event)">stats</button>
                <button class="tab" onclick="switchTab('evoChain', event)">evo chain</button>
            </div>

            <div class="modal-stats h-100">
             <!-- Main tab -->
              <div id="mainTab" class="tab-content" style="display: block;">
                <div class="stat-row">
                  <span class="stat-label">Height</span>
                  <span class="stat-value">: ${pokemon.height / 10} m</span>
                </div>
              <div class="stat-row">
                  <span class="stat-label">Weight</span>
                  <span class="stat-value">: ${pokemon.weight / 10} kg</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Base experience</span>
                <span class="stat-value">: ${pokemon.base_experience}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Abilities</span>
                <span class="stat-value">: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</span>
              </div>
            </div>

              <!-- Stats tab -->
             <div id="statsTab" class="tab-content p-3" style="display: none;">
                ${pokemon.stats.map(stat => `
               <div class="mb-3">
                <div class="text-secondary mb-2">${stat.stat.name}</div>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-danger" 
                         role="progressbar" 
                         style="width: ${(stat.base_stat / 255) * 100}%">
                         <span class="ms-2">${stat.base_stat}</span>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>

    <!-- Evolution chain tab -->
    <div id="evoChainTab" class="tab-content p-3" style="display: none;">
        <div id="evolution-chain" class="d-flex justify-content-center align-items-center gap-4">
            <!-- here will write by JavaScript -->
        </div>
    </div>
</div>
        </div>
    `;
}


function createEvolutionChainHTML(chain) {
    let html = '';
    for(let i = 0; i < chain.length; i++) {
        html += `
            <div class="text-center">
                <img src="${chain[i].image}" class="mb-2" style="width: 80px; height: 80px;" alt="${chain[i].name}">
                <p class="mb-0 text-capitalize">${chain[i].name}</p>
            </div>
        `;
        
        if(i < chain.length - 1) {
            html += '<div class="fs-4">&gt;&gt;</div>';
        }
    }
    return html;
}



