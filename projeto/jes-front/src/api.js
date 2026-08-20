import axios from "axios";

const token = localStorage.getItem("Mtoken")


const api = axios.create({
baseURL: 'URL_DA_API_DO_SEU_AMIGO',
  headers: {
    Authorization: `Bearer ${token}` // Envia no padrão Bearer Token
  }
})

export default api;