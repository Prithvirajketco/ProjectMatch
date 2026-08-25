import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? 'https://projectmatch-backend1.onrender.com/api' 
  : 'http://localhost:8000/api';
export const api = axios.create({
  baseURL: API_URL,
});

export const getCandidates = () => api.get('/candidates');
export const getProjects = () => api.get('/projects');
export const runMatch = (projectId) => api.post(`/match/${projectId}`);
export const getMatchResult = (resultId) => api.get(`/match/results/${resultId}`);
