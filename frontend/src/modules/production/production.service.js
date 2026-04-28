import api from '../../api/axios';

export const getProductionOrders = async () => {
  const response = await api.get('/production-orders');
  return response.data;
};

export const createProductionOrder = async (data) => {
  const response = await api.post('/production-orders', data);
  return response.data;
};

export const updateProductionStatus = async (id, statusData) => {
  const response = await api.put(`/production-orders/${id}/status`, statusData);
  return response.data;
};
