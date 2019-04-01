function userServices(request) {
  return{
    fetchUserRepos(username) {
      return request(`https://api.github.com/users/${username}/repos?access_token=2d051d3aee0f5e`)
    }
  }
}

export default userServices
