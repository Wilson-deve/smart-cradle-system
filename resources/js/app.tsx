import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { resolvePageByRole } from './utils/pageResolver';
import { PageProps } from '@inertiajs/core';
import axios from 'axios';

// Configure Axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add request interceptor to handle CSRF token
let isRefreshing = false;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        await axios.get('/sanctum/csrf-cookie');
        // Retry the original request
        const { config } = error;
        return await axios.request(config);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: async (name: string) => {
    console.log('Starting page resolution for:', name);
    
    // Get all available pages
    const pages = import.meta.glob<() => Promise<any>>('./Pages/**/*.tsx');
    console.log('All available pages:', Object.keys(pages));
    
    try {
      // Try to resolve the page using our custom resolver
      const component = await resolvePageByRole(name, pages);
      console.log('Resolved component:', component);
      return component;
    } catch (error) {
      console.error('Error resolving page:', error);
      // If our custom resolver fails, try the default resolver as fallback
      return resolvePageComponent(`./Pages/${name}.tsx`, pages);
    }
  },
  setup({ el, App, props }) {
    console.log('Inertia setup with props:', props);
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});
