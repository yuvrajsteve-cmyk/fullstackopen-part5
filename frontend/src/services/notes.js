import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/notes'

const setToken = () => {}

const create = async (newObject, userToken) => {
  const config = {
    headers: { Authorization: `Bearer ${userToken}` },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const removeAll = () => {
  const request = axios.delete(`${baseUrl}/clearall/everything`)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken, remove, removeAll }
