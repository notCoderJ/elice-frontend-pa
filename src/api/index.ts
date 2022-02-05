import axios from 'axios';

// TODO: 임시 proxy 사용 중
const API_BASE_URL = 'https://api-rest.elice.io/org/academy';

const api = axios.create({
  // baseURL: API_BASE_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
