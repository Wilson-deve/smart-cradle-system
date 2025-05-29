import { Fragment } from 'react';
import { Link } from '@inertiajs/react';
import {
  HomeIcon,
  VideoCameraIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  UsersIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { Role } from '@/types/roles';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles: Role[];
}

interface Props {
  userRole: Role;
  className?: string;
}

const navigation: NavItem[] = [
  // Admin Navigation
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: HomeIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: UsersIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Devices',
    href: '/admin/devices',
    icon: DevicePhoneMobileIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Monitoring',
    href: '/admin/monitoring',
    icon: VideoCameraIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Health Analytics',
    href: '/admin/health',
    icon: ChartBarIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'System Alerts',
    href: '/admin/alerts',
    icon: BellIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Permissions',
    href: '/admin/permissions',
    icon: ShieldCheckIcon,
    roles: [Role.ADMIN],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
    roles: [Role.ADMIN],
  },
  // Parent Navigation
  {
    name: 'Dashboard',
    href: '/parent/dashboard',
    icon: HomeIcon,
    roles: [Role.PARENT],
  },
  {
    name: 'Live Monitoring',
    href: '/parent/monitoring',
    icon: VideoCameraIcon,
    roles: [Role.PARENT],
  },
  {
    name: 'Health Reports',
    href: '/parent/health',
    icon: ChartBarIcon,
    roles: [Role.PARENT],
  },
  {
    name: 'Cradle Control',
    href: '/parent/controls',
    icon: Cog6ToothIcon,
    roles: [Role.PARENT],
  },
  {
    name: 'Alerts & Notifications',
    href: '/parent/alerts',
    icon: BellIcon,
    roles: [Role.PARENT],
  },
  {
    name: 'Babysitter Management',
    href: '/parent/babysitters',
    icon: UsersIcon,
    roles: [Role.PARENT],
  },
  // Babysitter Navigation
  {
    name: 'Dashboard',
    href: route('babysitter.dashboard'),
    icon: HomeIcon,
    roles: [Role.BABYSITTER],
  },
  {
    name: 'Live Monitoring',
    href: route('babysitter.monitoring'),
    icon: VideoCameraIcon,
    roles: [Role.BABYSITTER],
  },
  {
    name: 'Cradle Control',
    href: route('babysitter.controls'),
    icon: Cog6ToothIcon,
    roles: [Role.BABYSITTER],
  },
  {
    name: 'Messages',
    href: route('babysitter.messages'),
    icon: ChatBubbleLeftRightIcon,
    roles: [Role.BABYSITTER],
  },
];

export default function Sidebar({ userRole, className = '' }: Props) {
  const filteredNavigation = navigation.filter((item) => item.roles.includes(userRole));

  return (
    <div className={`flex h-full flex-col bg-gray-800 text-white ${className}`}>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <item.icon className="mr-3 h-6 w-6 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
