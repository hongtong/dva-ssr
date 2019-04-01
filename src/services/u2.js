function u2(request) {
  return{
    fetchUserRepos(username) {
      return request(`https://api.github.com/users/${username}/repos?access_token=2b120c16ef`)
    }
  }
}

export default u2
