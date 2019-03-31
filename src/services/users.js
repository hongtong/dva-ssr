function userServices(request) {
  return{
    fetchUserRepos(username) {
      return request(`https://api.github.com/users/${username}/repos?access_token=cb1eb0e942f77536e93f2f7acf8302197586055f`)
    }
  }
}

export default userServices
