import React from 'react';
import { User } from '@/types';
import { Menu, Transition } from '@headlessui/react';
import { Link, router } from '@inertiajs/react';
import { Fragment } from 'react';
import Sidebar from '@/Components/RoleBased/Sidebar';
import { Role } from '@/types/roles';

interface Props {
    user: User | null | undefined;
    children: React.ReactNode;
}

export default function AdminLayout({ children, user }: Props) {
    const handleLogout = () => {
        router.post('/logout');
    };

    // Redirect to login if no user
    React.useEffect(() => {
        if (!user) {
            router.visit('/login');
        }
    }, [user]);

    // Show loading state while checking auth
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen h-screen bg-gray-100 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar userRole={user.role as Role} className="w-72 flex-shrink-0 h-full" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                <nav className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-end h-16">
                            <div className="hidden sm:flex sm:items-center">
                                <div className="ml-3 relative">
                                    <Menu as="div" className="relative">
                                        <Menu.Button className="inline-flex rounded-md">
                                            <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                                                {user.name}
                                                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </Menu.Button>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="px-1 py-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link
                                                                href="/admin/profile"
                                                                className={`${
                                                                    active ? 'bg-gray-100' : ''
                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                                                            >
                                                                Profile
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={handleLogout}
                                                                className={`${
                                                                    active ? 'bg-gray-100' : ''
                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                                                            >
                                                                Log Out
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 overflow-auto">
                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
