export default class ApiError extends Error {
  constructor({
    message, code, api, response,
  }) {
    super(message)
    this.code = code
    this.api = api
    this.response = response
  }
}
