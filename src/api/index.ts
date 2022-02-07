import axios from 'axios';

const API_BASE_URL = 'https://api-rest.elice.io/org/academy';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 시간초과로 10초로 변경.
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
