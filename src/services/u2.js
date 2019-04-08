function u2(request) {
  return {
    fetchUserRepos(username) {
      return request(`https://api.github.com/users/${username}/repos?access_token=c34c2304e0ded4f21e8e4bcf8a3ab549c1b7359b`)
    },
  }
}

export default u2
