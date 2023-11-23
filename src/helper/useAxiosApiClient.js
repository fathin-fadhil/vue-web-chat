import axios from "axios";

export default function useAxiosApiClient() {
  return axios.create({
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json',
    }, 
    baseURL: import.meta.env.VITE_BASE_URL
  })
}