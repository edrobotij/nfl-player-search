let nflService = {

  getPlayers: () => {
    const url = 'http://api.fantasy.nfl.com/players/stats?statType=seasonStats&season=2016&format=json';

    return fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(Error('getPlayers error'));
      }).catch(error => {
        return Promise.reject(Error(error.message));
      });
  }
};

module.exports = nflService;
