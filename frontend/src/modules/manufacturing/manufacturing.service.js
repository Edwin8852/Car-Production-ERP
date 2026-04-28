import api from '../../api/axios';

export const updateStageStatus = async (id, status) => {
  const response = await api.patch(`/manufacturing/${id}/status`, { status });
  return response.data;
};

export const getManufacturingStages = async (productionOrderId) => {
  const response = await api.get(`/manufacturing/production-order/${productionOrderId}`);
  return response.data;
};
