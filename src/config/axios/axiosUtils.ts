import instance from './axiosConfig'
import { AxiosError, AxiosResponse } from 'axios'

const apiGet = async <T>(url: string): Promise<AxiosResponse<T>> => instance.get<T>(url)

const fetchData = async (
  url: string,
  successHandler: (arg0: AxiosResponse<any, any>) => any,
  errorHandler: (arg0: AxiosError | unknown) => unknown
) => {
  try {
    const response: AxiosResponse<any, any> = await apiGet(url)
    successHandler(response.data)
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      const { error } = err?.response?.data
      errorHandler(error)
    }
  }
}

export { apiGet, fetchData }
