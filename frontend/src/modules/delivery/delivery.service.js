import api from '../../api/axios';

export const getDeliveries = async () => {
  const response = await api.get('/delivery');
  return response.data;
};

export const createDelivery = async (data) => {
  const response = await api.post('/delivery', data);
  return response.data;
};
