import { api } from './api';

export const AuthService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;

    localStorage.setItem('user', JSON.stringify(userData)); // Save user in local storage
    localStorage.setItem('token', userData.token); // Save token

    return userData;
  },

  async register(name: string, email: string, password: string, role: string = 'user') {
    return api.post('/auth/register', { name, email, password, role });
  },

  async getProfile() {
    return api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};


