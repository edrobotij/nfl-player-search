let ffrosters = (function() {
  const url = 'http://api.fantasy.nfl.com/players/stats?statType=seasonStats&season=2016&format=json';
  const players = [];

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
    console.log('fetching players from api...')
    fetch(url)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            players.push(...json.players);
            localStorage.setItem('players', JSON.stringify(players));
            console.log('done.');
          });
        }
      });
  } else {
    console.log('fetching players from storage...');
    players.push(...JSON.parse(localStorage.getItem('players')));
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
      const matchArray = findMatches(this.value, players);
      const html = matchArray.map(player => {
        const regex = new RegExp(this.value, 'ig');
        const playerName = player.name.replace(regex, match => {
          return `<span class="match">${match}</span>`;
        });
        const team = player.teamAbbr === '' ? 'FA' : player.teamAbbr;

        return `
          <li>
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

  const searchInput = document.querySelector('.search');
  const results = document.querySelector('.results');

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', displayMatches);
})();

module.exports = ffrosters;
