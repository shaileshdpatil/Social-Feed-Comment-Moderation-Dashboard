import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LazyWrapper, notFoundRoute, protectedRoutes, publicRoutes } from './config/routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import type React from 'react';
import axios from 'axios';
import { Toaster } from 'sonner';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AppRoutes = () => {
  const routesList = [...publicRoutes, ...protectedRoutes, notFoundRoute];
  const routes = useRoutes(routesList);
  return (
    <LazyWrapper>{routes}</LazyWrapper>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <BrowserRouter basename="/">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
    <Toaster />
  </ErrorBoundary>
);

export default App;
