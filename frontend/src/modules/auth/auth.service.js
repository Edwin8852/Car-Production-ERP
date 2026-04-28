import api from '../../api/axios';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return localStorage.getItem('token'); // Just checking if token exists for simplicity
};
