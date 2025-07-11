import axios from 'axios';

const API_BASE = 'http://localhost:8080';

export const fetchGuestList = async () => {
  const response = await axios.get(`${API_BASE}/guestList`);
  return response.data;
};