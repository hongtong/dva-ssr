import userServices from '../services/users'

function userModel(request) {
  const { fetchUserRepos } = userServices(request)

  return {
    namespace: 'user',
    state: {
      issues: [],
      orgs: [],
      repos: [],
      gists: [],
    },
    reducers: {
      saveIssues(state, { payload: issues }) {
        return {
          ...state,
          issues,
        }
      },
      saveOrgs(state, { payload: orgs }) {
        return {
          ...state,
          orgs,
        }
      },
      saveRepos(state, { payload: repos }) {
        return {
          ...state,
          repos,
        }
      },
      saveGists(state, { payload: gists }) {
        return {
          ...state,
          gists,
        }
      },
    },
    effects: {
      * fetchUserRepos({ payload: username }, { put, call }) {
        const repos = yield call(fetchUserRepos, username)
        yield put({ type: 'saveRepos', payload: repos.data })
      },
    },
  }
}

export default userModel
