import { ReactNode } from 'react';
import { CogIcon, UsersIcon, DeviceMobileIcon, ChartBarIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/outline';

interface NavigatioItem {
    name: string;
    href: string;
    icon: ReactNode;
    roles: string[];
    current?: boolean;
}

export const navigation: NavigatioItem[] = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: <ChartBarIcon className="h-6 w-6" aria-hidden="true" />,
        roles: ['admin', 'parent', 'babysitter'],
    },
    {
        name: 'User Management',
        href: '/admin/users',
        icon: <UsersIcon className="h-6 w-6" aria-hidden="true" />,
        roles: ['admin'],
    },
    {
        name: 'Device Assignment',
        href: '/admin/devices',
        icon: <DeviceMobileIcon className="h-6 w-6" aria-hidden="true" />,
        roles: ['admin'],
    },
    {
        name: 'Permissions',
        href: '/admin/permissions',
        icon: <ShieldCheckIcon className="h-6 w-6" aria-hidden="true" />,
        roles: ['admin'],
    },
    {
        name: 'System Settings',
        href: '/admin/settings',
        icon: <CogIcon className="h-6 w-6" aria-hidden="true" />,
        roles: ['admin'],
    },
    {
        name: 'My Cradle',
        href: '/parent/cradle',
        icon: <DeviceMobileIcon className="h-6 w-6" aria-hidden="true" />,
        roles: ['parent'],
    },
    {
        name: 'Health Reports',
        href: '/parent/reports',
        icon: <ChartBarIcon className="h-5 w-5" />,
        roles: ['parent'],
    },
    {
        name: 'Monitoring',
        href: '/monitoring',
        icon: <DeviceMobileIcon className="h-6 w-6" aria-hidden="true" />,
        roles: ['admin'],
    },
    {
        name: 'Notifications',
        href: '/admin/notifications',
        icon: <BellIcon className="h-6 w-6" aria-hidden="true" />,
        roles: ['admin'],
    },
    {
        name: 'Notifications',
        href: '/notifications',
        icon: <BellIcon className="h-6 w-6" aria-hidden="true" />,
        roles: ['admin', 'parent', 'babysitter'],
    },
];