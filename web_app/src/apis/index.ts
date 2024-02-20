import axios from "axios";

const request = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? process.env.PROD_URL : process.env.DEV_URL,
  timeout: 5000,
});

// export function login(data) {

// }

// export function getUser() {}

export function getDevice() {
  return request.get("/device");
}

export function getConfig() {
  
}

