import render from './render'
import status from './status'

const middleware = [status]
const csr = true

export default csr ? middleware : [render, ...middleware]
