import { Page, PageProps } from '@inertiajs/core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface Props extends PageProps {
  auth: {
    user: User;
  };
}

type PageModule = () => Promise<any>;

declare global {
  interface Window {
    __INITIAL_DATA__?: Props;
  }
}

export const resolvePageByRole = async (
  name: string,
  pages: Record<string, PageModule>
): Promise<unknown> => {
  console.log('Resolving page:', name);
  console.log('Available pages:', Object.keys(pages));
  
  // Get the user's role from the window object
  const props = window.__INITIAL_DATA__;
  const role = props?.auth?.user?.role;
  console.log('User role from props:', role);
  
  // If we have a role and this is a dashboard request, redirect to role-specific dashboard
  if (role && name === 'Dashboard') {
    // Convert role to proper case (e.g., "admin" -> "Admin")
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    const roleDashboardPath = `./Pages/${formattedRole}/Dashboard.tsx`;
    console.log('Looking for role-specific dashboard:', roleDashboardPath);
    
    if (pages[roleDashboardPath]) {
      console.log('Found role-specific dashboard');
      return pages[roleDashboardPath]();
    }
  }
  
  // If the page name includes a role prefix (Admin/, Parent/, Babysitter/), use it directly
  if (name.includes('/')) {
    const pagePath = `./Pages/${name}.tsx`;
    console.log('Looking for page with path:', pagePath);
    if (pages[pagePath]) {
      console.log('Found direct path page');
      return pages[pagePath]();
    }
  }
  
  // Try role-specific page
  if (role) {
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    const rolePage = `./Pages/${formattedRole}/${name}.tsx`;
    console.log('Looking for role-specific page:', rolePage);
    if (pages[rolePage]) {
      console.log('Found role-specific page');
      return pages[rolePage]();
    }
  }

  // Fallback to the default page
  const defaultPage = `./Pages/${name}.tsx`;
  console.log('Looking for default page:', defaultPage);
  if (pages[defaultPage]) {
    console.log('Found default page');
    return pages[defaultPage]();
  }

  console.error('No page found for:', name);
  console.error('User role:', role);
  console.error('Available pages:', Object.keys(pages));
  throw new Error(`Page not found: ${name}`);
}; 