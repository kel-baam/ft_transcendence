export function createPlayerSelection(players) {

    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search players...';
    searchBox.classList.add('search-box');
    
    const resultsContainer = document.createElement('ul');
    resultsContainer.classList.add('results-container');

    const selectedPlayersContainer = document.createElement('div');
    selectedPlayersContainer.classList.add('selected-players-container');

    let selectedPlayers = [];

    function filterPlayers() {
        const searchTerm = searchBox.value.toLowerCase();
        resultsContainer.innerHTML = '';
    
        if (searchTerm.trim() === '') {
            resultsContainer.style.display = 'none';
            return;
        }
    
        players.forEach(player => {
            if (player.username.toLowerCase().includes(searchTerm)) {
                const playerItem = document.createElement('li');
                playerItem.textContent = player.username;
                playerItem.classList.add('player-item');
                playerItem.dataset.playerId = player.id;
    
                playerItem.addEventListener('click', () => {
                    if (selectedPlayers.length < 3 && !selectedPlayers.includes(player.id))
                    {
                        selectedPlayers.push(player.id);
                        updateSelectedPlayers();
                        searchBox.value = '';
                        resultsContainer.style.display = 'none';
                    }
                });
    
                resultsContainer.appendChild(playerItem);
            }
        });

        if (resultsContainer.childElementCount > 0) { resultsContainer.style.display = 'block'; }
        else { resultsContainer.style.display = 'none'; }
    }
    

    function updateSelectedPlayers() {
        selectedPlayersContainer.innerHTML = '';
    
        const hiddenInputs = document.querySelectorAll('.selected-player-input');
        hiddenInputs.forEach(input => input.remove());
    
        selectedPlayers.forEach(playerId => {
            const selectedPlayer = players.find(player => player.id === playerId);
    
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');
            
            const username = document.createElement('h3');
            playerCard.appendChild(username);
            username.textContent = selectedPlayer.username;
    
            const cancelButton = document.createElement('i');
            cancelButton.className = 'fa-regular fa-circle-xmark';
            cancelButton.addEventListener('click', () => {
                selectedPlayers = selectedPlayers.filter(id => id !== playerId);
                updateSelectedPlayers();
            });
            playerCard.appendChild(cancelButton);
            selectedPlayersContainer.appendChild(playerCard);
    
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'selectedPlayers[]'; 
            hiddenInput.value = playerId;
            hiddenInput.classList.add('selected-player-input');
            formContainer.appendChild(hiddenInput);
        });
    }
    
    searchBox.addEventListener('input', filterPlayers);
    const searchWrapper = document.createElement('div');

    searchWrapper.style.position = 'relative'; 
    const formContainer = document.getElementById('add_players');

    formContainer.appendChild(selectedPlayersContainer);
    searchWrapper.appendChild(resultsContainer);
    searchWrapper.appendChild(searchBox);
    formContainer.appendChild(searchWrapper);

    return selectedPlayersContainer;
}

async function fetchCsrfToken() {
    const response = await fetch('http://localhost:8000/tournament/api/csrf-token/');
    const data = await response.json();
    return data.csrfToken;
}

export async function addPlayerSelection() {
    try {
        const csrfToken = await fetchCsrfToken();

        const response = await fetch('http://localhost:8000/tournament/api/fetch_users/', {
            method: 'GET',
            headers: { 'X-CSRFToken': csrfToken },
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const players = await response.json();
        console.log("players ---------> ", players);
        const dropdown = createPlayerSelection(players);

        const formContainer = document.getElementById('add_players');
        console.log(formContainer)
        formContainer.appendChild(dropdown);

    } catch (error) {
        console.error('Error fetching players:', error.message);
    }
}
