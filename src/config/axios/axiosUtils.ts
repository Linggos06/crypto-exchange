import instance from './axiosConfig'
import { AxiosResponse } from 'axios'

const apiGet = async <T>(url: string): Promise<AxiosResponse<T>> => instance.get<T>(url)

export { apiGet }
