import axios from 'axios';

// Configuración base de Axios
const apiClient = axios.create({
  baseURL: 'https://api.ejemplo.com', // Reemplaza con tu URL base
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  // timeout: 10000, // 10 segundos
});

// Interceptor para manejar tokens de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores específicos (401, 403, etc.)
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.status === 401) {
        // Redirigir al login o manejar la sesión expirada
        localStorage.removeItem('authToken');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;