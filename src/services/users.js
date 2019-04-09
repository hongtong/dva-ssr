function userServices(request) {
  return {
    fetchUserRepos(username) {
      return request(`https://api.github.com/users/${username}/repos?access_token=`)
    },
  }
}

export default userServices
