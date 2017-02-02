let redditService = {

  getRedditPosts: (playerName) => {
    const url = `https://www.reddit.com/r/fantasyfootball/search.json?q=${playerName}&restrict_sr=on`;
    return fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(Error('getRedditPosts error'));
      }).catch(error => {
        return Promise.reject(Error(error.message));
      });
  }
};

module.exports = redditService;
