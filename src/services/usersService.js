import { api, isTokenValid } from './httpClient';

export const fetchUsers = async () => {
  // If there is no token or token is expired, skip network call and return empty list to avoid 403 spam
  try {
    const token = localStorage.getItem('token');
    if (!token || !isTokenValid(token)) {
      // clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return [];
    }
    const res = await api.get('/users/technicians');
    return res.data;
  } catch (err) {
    throw err;
  }
};
