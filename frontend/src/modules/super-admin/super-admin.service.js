import api from '../../api/axios';

// ─────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────
export const getSuperAdminStats = async () => {
  const res = await api.get('/super-admin/stats');
  return res.data.data;
};

// ─────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────
export const getAllUsers = async () => {
  const res = await api.get('/super-admin/users');
  return res.data.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/super-admin/users/${id}`);
  return res.data.data;
};

export const createUser = async (data) => {
  const res = await api.post('/super-admin/users', data);
  return res.data.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/super-admin/users/${id}`, data);
  return res.data.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/super-admin/users/${id}`);
  return res.data;
};

// ─────────────────────────────────────────
// ROLE MANAGEMENT
// ─────────────────────────────────────────
export const getAllRoles = async () => {
  const res = await api.get('/super-admin/roles');
  return res.data.data;
};

export const createRole = async (data) => {
  const res = await api.post('/super-admin/roles', data);
  return res.data.data;
};

export const deleteRole = async (id) => {
  const res = await api.delete(`/super-admin/roles/${id}`);
  return res.data;
};

// ─────────────────────────────────────────
// SYSTEM SETTINGS
// ─────────────────────────────────────────
export const getAllSettings = async () => {
  const res = await api.get('/super-admin/settings');
  return res.data.data;
};

export const upsertSetting = async (key, value) => {
  const res = await api.put('/super-admin/settings', { key, value });
  return res.data.data;
};

export const deleteSetting = async (key) => {
  const res = await api.delete(`/super-admin/settings/${key}`);
  return res.data;
};

// ─────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────
export const getRevenueReport = async () => {
  const res = await api.get('/super-admin/reports/revenue');
  return res.data.data;
};

export const getTopCustomers = async () => {
  const res = await api.get('/super-admin/reports/top-customers');
  return res.data.data;
};

export const getLowStockMaterials = async () => {
  const res = await api.get('/super-admin/reports/low-stock');
  return res.data.data;
};

export const getProductionSummary = async () => {
  const res = await api.get('/super-admin/reports/production');
  return res.data.data;
};
