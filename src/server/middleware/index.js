import apiErrorHandle from './apiErrorHandle'
import render from './render'
import status from './status'

const middleware = [status]
const csr = false

export default csr ? middleware : [apiErrorHandle, render, ...middleware]
