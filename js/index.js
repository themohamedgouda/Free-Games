// Games Class
class Games {
    constructor(ui) {
        this.gamesContainer = document.getElementById('games');
        this.ui = ui;
        this.gameContainer = [];
    }

    async fetchGames(category) {
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '5870e631a8mshb5ef7b7ba276ef7p18a20cjsnaac83831e93c',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        try {
            const api = await fetch(url, options);
            const data = await api.json();
            this.gameContainer = data;
            this.ui.displayGames(); // Call method to display games
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    }
}

// Details Class
class Details {
    constructor(ui) {
        this.detailGameSection = document.getElementById('detailGame');
        this.ui = ui;
    }

    async fetchDetails(id) {
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '5870e631a8mshb5ef7b7ba276ef7p18a20cjsnaac83831e93c',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            this.ui.displayDetails(result); // Call method to display details
        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    }
}

// UI Class
class UI {
    constructor() {
        this.gamesContainer = document.getElementById('games');
        this.detailGameSection = document.getElementById('detailGame');
        this.links = document.querySelectorAll('.nav-link');
        this.games = new Games(this);
        this.details = new Details(this);
        this.directLink = 'mmorpg'; // Initial category
        this.currentActiveLink = null; // To store the currently active navigation link
    }

    handleLinkClicks() {
        for (let i = 0; i < this.links.length; i++) {
            const link = this.links[i];
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentActiveLink) {
                    this.currentActiveLink.classList.remove('active');
                }
                this.directLink = link.dataset.category;
                link.classList.add('active');
                this.currentActiveLink = link;
                this.games.fetchGames(this.directLink); // Fetch games for selected category
            });
        }

        // Initial load
        this.games.fetchGames(this.directLink);
        if (this.links.length > 0) {
            this.links[0].classList.add('active');
            this.currentActiveLink = this.links[0];
        }
    }

    displayGames() {
        let dataGames = '';
        for (let i = 0; i < this.games.gameContainer.length; i++) {
            const game = this.games.gameContainer[i];
            dataGames += `
                <div class="col-md-4 col-lg-3 col-sm-6">
                    <div class="card h-100 bg-transparent text-white" data-id="${game.id}">
                        <img src="${game.thumbnail}" class="card-img-top w-100 img-fluid" alt="...">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h6 class="card-title m-0">${game.title}</h6>
                                <button class="btn btn-color btn-sm rounded text-white">Free</button>
                            </div>
                            <p class="card-text text-center text-secondary">${game.short_description}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between align-items-center">
                            <span class="text-white">${game.genre}</span>
                            <span class="text-white">${game.platform}</span>
                        </div>
                    </div>
                </div>`;
        }
        this.gamesContainer.innerHTML = dataGames;

        // Add event listeners to each card
        let cards = this.gamesContainer.querySelectorAll('.card');
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            card.addEventListener('click', () => {
                let gameId = card.getAttribute('data-id');
                this.details.fetchDetails(gameId); // Call method to fetch details
            });
        }
    }

    displayDetails(detailGame) {
        let metagame = `
            <div class="container">
                <header class="hstack justify-content-between">
                    <h1 class="text-center h3 py-4 text-white">Details Game</h1>
                    <button class="btn-close btn-close-white" id="btnClose"></button>
                </header>
                <div class="row g-4" id="detailsContent">
                    <div class="col-md-4">
                        <div class="picture">
                            <img src="${detailGame.thumbnail}" class="w-100" alt="">
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="content text-white">
                            <h4>Title: ${detailGame.title}</h4>
                            <p class="py-2">Category: <span class="bg-info text-black rounded px-1">${detailGame.genre}</span></p>
                            <p class="pb-2">Platform: <span class="bg-info text-black rounded px-1">${detailGame.platform}</span></p>
                            <p>Status: <span class="bg-info text-black rounded px-1">${detailGame.status}</span></p>
                            <p>${detailGame.description}</p>
                            <button class="btn btn-outline-warning">
                                <a href="${detailGame.freetogame_profile_url}" target="_blank" class="text-decoration-none text-white">Show Game</a>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        this.detailGameSection.innerHTML = metagame;
        this.detailGameSection.classList.remove('d-none'); // Show details section
        document.getElementById('mainSection').classList.add('d-none')

        // Close button event listener
        document.getElementById('btnClose').addEventListener('click', () => {
            this.detailGameSection.classList.add('d-none'); // Hide details section
            document.getElementById('mainSection').classList.remove('d-none')
        });
    }
}

// Instantiate UI class
const ui = new UI();

// Initialize event listeners and initial load
ui.handleLinkClicks();
