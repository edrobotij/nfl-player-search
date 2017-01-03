module.exports = (function() {
  const url = 'http://api.fantasy.nfl.com/players/stats?statType=seasonStats&season=2016&format=json';
  let players;

  fetch(url)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          players = json.players;
        });
      }
    });
}());
