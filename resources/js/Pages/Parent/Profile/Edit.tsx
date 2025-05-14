import ParentLayout from '@/Layouts/ParentLayout';
import { Tab } from '@headlessui/react';
import {
  DevicePhoneMobileIcon,
  KeyIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
  user: {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
    created_at: string;
    last_login_at: string | null;
  };
  devices: Array<{
    id: number;
    name: string;
    status: string;
    sensor_readings: Array<{
      type: string;
      value: number;
      unit: string;
      created_at: string;
    }>;
    last_reading_at: string;
  }>;
  flash?: {
    message: string;
    type: 'success' | 'error';
  };
}

export default function Edit({ user, devices, flash }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    data: profileData,
    setData: setProfileData,
    patch: updateProfile,
    processing: profileProcessing,
    errors: profileErrors,
  } = useForm({
    name: user.name,
    email: user.email,
  });

  const {
    data: passwordData,
    setData: setPasswordData,
    patch: updatePassword,
    processing: passwordProcessing,
    errors: passwordErrors,
    reset: resetPassword,
  } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(route('parent.profile.update'), {
      preserveScroll: true,
      onSuccess: () => {
        profileData.reset();
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePassword(route('parent.profile.password'), {
      preserveScroll: true,
      onSuccess: () => {
        passwordData.reset();
      },
    });
  };

  const handleDeleteAccount = () => {
    router.delete(route('parent.profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => {
        router.visit('/');
      },
    });
  };

  return (
    <ParentLayout>
      <Head title="Profile" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {flash?.message && (
            <div
              className={`mb-4 rounded-md p-4 ${flash.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}
            >
              <p
                className={`text-sm ${flash.type === 'success' ? 'text-green-800' : 'text-red-800'}`}
              >
                {flash.message}
              </p>
            </div>
          )}

          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                  <Tab
                    className={({ selected }) =>
                      `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                        selected
                          ? 'bg-white text-indigo-600 shadow'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                      }`
                    }
                  >
                    <div className="flex items-center justify-center">
                      <UserIcon className="mr-2 h-5 w-5" />
                      Profile Information
                    </div>
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                        selected
                          ? 'bg-white text-indigo-600 shadow'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                      }`
                    }
                  >
                    <div className="flex items-center justify-center">
                      <KeyIcon className="mr-2 h-5 w-5" />
                      Update Password
                    </div>
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                        selected
                          ? 'bg-white text-indigo-600 shadow'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                      }`
                    }
                  >
                    <div className="flex items-center justify-center">
                      <DevicePhoneMobileIcon className="mr-2 h-5 w-5" />
                      My Devices
                    </div>
                  </Tab>
                </Tab.List>

                <Tab.Panels className="mt-4">
                  <Tab.Panel>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData('name', e.target.value)
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {profileErrors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {profileErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData('email', e.target.value)
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {profileErrors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {profileErrors.email}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="submit"
                          disabled={profileProcessing}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {profileProcessing ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </Tab.Panel>

                  <Tab.Panel>
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="current_password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="current_password"
                          value={passwordData.current_password}
                          onChange={(e) =>
                            setPasswordData('current_password', e.target.value)
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {passwordErrors.current_password && (
                          <p className="mt-1 text-sm text-red-600">
                            {passwordErrors.current_password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={passwordData.password}
                          onChange={(e) =>
                            setPasswordData('password', e.target.value)
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {passwordErrors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {passwordErrors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="password_confirmation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="password_confirmation"
                          value={passwordData.password_confirmation}
                          onChange={(e) =>
                            setPasswordData(
                              'password_confirmation',
                              e.target.value,
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="submit"
                          disabled={passwordProcessing}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {passwordProcessing
                            ? 'Updating...'
                            : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </Tab.Panel>

                  <Tab.Panel>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {devices.map((device) => (
                          <div
                            key={device.id}
                            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                          >
                            <h3 className="text-lg font-medium text-gray-900">
                              {device.name}
                            </h3>
                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                  Status
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    device.status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {device.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                  Last Reading
                                </span>
                                <span className="text-sm text-gray-900">
                                  {device.last_reading_at
                                    ? new Date(
                                        device.last_reading_at,
                                      ).toLocaleString()
                                    : 'Never'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>

              <div className="mt-10 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Delete Account
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Once your account is deleted, all of its resources and
                      data will be permanently deleted.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <TrashIcon className="mr-2 h-5 w-5" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <TrashIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Delete Account
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ParentLayout>
  );
}
