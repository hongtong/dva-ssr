import apiErrorHandle from './apiErrorHandle'
import reactApplication from './reactApplication'
import status from './status'

const middleware = [status]
const csr = false

export default csr ? middleware : [apiErrorHandle, reactApplication, ...middleware]
