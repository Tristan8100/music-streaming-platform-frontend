
import axios from 'axios';
import router from 'next/router';
import { useEffect } from 'react';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:4000', // Laravel or any backend
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const api2 = axios.create({
  baseURL: 'http://127.0.0.1:4000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api2.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

