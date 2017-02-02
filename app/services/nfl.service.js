let nflService = {

  getPlayers: () => {
    const url = 'http://api.fantasy.nfl.com/v1/players/stats?statType=seasonStats&season=2016&format=json';

    return fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(Error('getPlayers error'));
      }).catch(error => {
        return Promise.reject(Error(error.message));
      });
  },

  getPlayer: playerId => {
    const url = `http://api.fantasy.nfl.com/v1/players/details?playerId=${playerId}&statType=seasonStatsformat=json`;

    return fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(Error('getPlayer error'));
      }).catch(error => {
        return Promise.reject(Error(error.message));
      });
  }
};

module.exports = nflService;
