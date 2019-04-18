import apiErrorHandle from './apiErrorHandle'
import reactApplication from './reactApplication'
import status from './status'

const middleware = [status]

export default [apiErrorHandle, reactApplication, ...middleware]

export const csr = middleware
