import { METHOD, type Endpoints } from '../types'

const endpoints = {
  getUsers: '/users',
  createUser: {
    method: METHOD.POST,
    path: '/users',
  },
  updateUser: {
    method: METHOD.PATCH,
    path: '/users/:id',
  },
  deleteUser: '/users/:id',
}

// for type checking
const checkEndpoints: Endpoints = endpoints

export default endpoints
