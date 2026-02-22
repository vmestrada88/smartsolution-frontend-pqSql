import { api } from './httpClient';

export const fetchTasks = async (params = {}) => {
  const res = await api.get('/jobs', { params });
  return res.data;
};

export const createTask = async (task) => {
  const res = await api.post('/jobs', task);
  return res.data;
};

export const updateTask = async (id, updates) => {
  const res = await api.put(`/jobs/${id}`, updates);
  return res.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/jobs/${id}`);
  return id;
};
