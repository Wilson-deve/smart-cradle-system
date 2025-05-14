import { Role } from '@/types/roles';
import {
  ArrowPathIcon,
  BellIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  MusicalNoteIcon,
  ShieldCheckIcon,
  UsersIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import React from 'react';

// Define navigation item interface
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: Role[];
  badge?: string;
}

// Define navigation items
const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: [Role.ADMIN, Role.PARENT, Role.BABYSITTER],
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: UsersIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Cradle Devices',
    href: '/admin/devices',
    icon: DevicePhoneMobileIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'My Devices',
    href: '/parent/devices',
    icon: DevicePhoneMobileIcon,
    roles: [Role.PARENT],
  },
  {
    name: 'Live Monitoring',
    href: '/admin/monitoring',
    icon: VideoCameraIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Live Monitoring',
    href: '/parent/monitoring',
    icon: VideoCameraIcon,
    roles: [Role.PARENT, Role.BABYSITTER],
  },
  {
    name: 'Cradle Controls',
    href: '/parent/controls',
    icon: ArrowPathIcon,
    roles: [Role.PARENT, Role.BABYSITTER],
  },
  {
    name: 'Lullabies & Media',
    href: '/parent/media',
    icon: MusicalNoteIcon,
    roles: [Role.PARENT, Role.BABYSITTER],
  },
  {
    name: 'Health Analytics',
    href: '/admin/health',
    icon: ChartBarIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Health Analytics',
    href: '/parent/health',
    icon: ChartBarIcon,
    roles: [Role.PARENT],
  },
  {
    name: 'Alerts & Notifications',
    href: '/admin/alerts',
    icon: BellIcon,
    roles: [Role.ADMIN],
    badge: '3',
  },
  {
    name: 'Alerts & Notifications',
    href: '/parent/alerts',
    icon: BellIcon,
    roles: [Role.PARENT, Role.BABYSITTER],
    badge: '3',
  },
  {
    name: 'Babysitter Management',
    href: '/parent/babysitters',
    icon: UsersIcon,
    roles: [Role.PARENT],
  },
  {
    name: 'Permissions',
    href: '/admin/permissions',
    icon: ShieldCheckIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
    roles: [Role.ADMIN],
  },
];

interface SidebarProps {
  userRole: Role;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, className = '' }) => {
  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <div className={`flex h-full flex-col bg-gray-800 text-white ${className}`}>
      <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <Link href="/" className="text-xl font-bold">
            Smart Baby Cradle
          </Link>
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <item.icon
                className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                aria-hidden="true"
              />
              {item.name}
              {item.badge && (
                <span className="ml-auto inline-block rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium text-white">Role: {userRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
