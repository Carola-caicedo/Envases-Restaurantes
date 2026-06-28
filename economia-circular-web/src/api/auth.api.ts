import api from './axios';

export const authApi = {
  login: async (credentials: any) => {
    return api.post('/auth/login', credentials);
  },
};
