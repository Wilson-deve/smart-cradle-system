import Sidebar from '@/Components/RoleBased/Sidebar';
import { Role } from '@/types/roles';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Link, router } from '@inertiajs/react';
import { Fragment, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminLayout({ children, user }: Props) {
  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition duration-200 ease-in-out">
        <Sidebar userRole={Role.ADMIN} />
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top Navigation */}
        <div className="bg-white shadow">
          <div className="flex h-16 items-center justify-end px-4">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {user && (
                    <div className="border-b border-gray-200 px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/admin/profile"
                        className={`block px-4 py-2 text-sm text-gray-700 ${
                          active ? 'bg-gray-100' : ''
                        }`}
                      >
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`block w-full px-4 py-2 text-left text-sm text-gray-700 ${
                          active ? 'bg-gray-100' : ''
                        }`}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <main className="py-6">
          <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
