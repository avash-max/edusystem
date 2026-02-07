import axios from "axios";

const ApiFromData = axios.create({
  baseURL : import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers :{
    "content-Type":"multipart/form-data"
  },
});

const Api = axios.create({
  baseURL : import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers :{
    "content-Type":"application/json"
  },
});

const config = {
  headers: {
    'authorization': `Bearer ${localStorage.getItem('token')}`
  }
}

export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("/api/user/login", data);
export const getUserApi = () => Api.get("/api/user/all-users", );
export const deleteUserById = (data) => Api.delete(`/api/user/deleteuser/${data}` );