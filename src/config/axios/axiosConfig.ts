import axios, { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: 'https://api.changenow.io/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
