import api from './axios';

export const getDashboardStatsAPI = async () => {
  const res = await api.get('/reportes/dashboard');
  return res.data.data;
};
