const redditService = require('./services/reddit.service');
const nflService = require('./services/nfl.service');

const ffrosters = (function() {
  const players = [];
  const redditPosts = [];
  const searchInput = document.querySelector('.search');
  const results = document.querySelector('.results');

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', displayMatches);
  results.addEventListener('click', selectPlayer);

  // Check for expire timestamp in localStorage.
  if (!localStorage.getItem('expire')) {
    let expire = Date.now() + (1000 * 60 * 60 * 24); // 1 day
    localStorage.setItem('expire', expire);
  } else if (Date.now() > localStorage.getItem('expire')) {
    let expire = Date.now() + (1000 * 60 * 60 * 24); // 1 day
    localStorage.removeItem('players');
    localStorage.setItem('expire', expire);
  }

  if (!localStorage.getItem('players')) {
    console.log('fetching players from api...');
    nflService.getPlayers().then(data => {
      players.push(...data.players);
      localStorage.setItem('players', JSON.stringify(players));
      console.log(players);
      console.log('done.');
    });
  } else {
    console.log('fetching players from storage...');
    players.push(...JSON.parse(localStorage.getItem('players')));
    console.log(players);
    console.log('done.');
  }

  function findMatches(input, players) {
    return players.filter(player => {
      const regex = new RegExp(input, 'ig');
      return player.name.match(regex);
    });
  }

  function displayMatches(e) {
    // Clear text box with escape key.
    if (e.keyCode === 27) {
      this.value = '';
    }

    if (this.value !== '') {
      searchInput.blur();
      searchInput.focus();
      const matchArray = findMatches(this.value, players);
      const html = matchArray.map(player => {
        const regex = new RegExp(this.value, 'ig');
        const playerName = player.name.replace(regex, match => {
          return `<span class="match">${match}</span>`;
        });
        const team = player.teamAbbr === '' ? 'FA' : player.teamAbbr;

        return `
          <li data-player-name="${player.name}" data-player-id="${player.id}">
            <span class="name">${playerName}</span>
            <span class="info">${team} &mdash; ${player.position}</span>
          </li>
        `;
      }).join('');

      results.innerHTML = html;
    } else {
      results.innerHTML = '';
    }
  }

  function selectPlayer(e) {
    searchInput.focus();
    let playerName;
    let playerId;

    if (e.target.nodeName === 'LI') {
      playerName = e.target.dataset.playerName;
      playerId = e.target.dataset.playerId;
    } else if (e.target.parentNode.nodeName === 'LI') {
      playerName = e.target.parentNode.dataset.playerName;
      playerId = e.target.parentNode.dataset.playerId;
    } else if (e.target.parentNode.parentNode.nodeName === 'LI') {
      playerName = e.target.parentNode.parentNode.dataset.playerName;
      playerId = e.target.parentNode.parentNode.dataset.playerId;
    }

    nflService.getPlayer(playerId).then(data => {
      console.log(data);
    });

    redditService.getRedditPosts(playerName).then(data => {
      console.log(data);
    });
  }
})();

module.exports = ffrosters;
