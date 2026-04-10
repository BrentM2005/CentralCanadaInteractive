import axios from 'axios';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});