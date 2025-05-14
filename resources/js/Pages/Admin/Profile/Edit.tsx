import AdminLayout from '@/Layouts/AdminLayout';
import { Tab } from '@headlessui/react';
import {
  KeyIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Head, useForm } from '@inertiajs/react';
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
  flash?: {
    message: string;
    type: 'success' | 'error';
  };
}

export default function Edit({ user, flash }: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
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

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(route('admin.profile.update'));
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    updatePassword(route('admin.profile.password'), {
      onSuccess: () => resetPassword(),
    });
  };

  const deleteAccount = () => {
    router.delete(route('admin.profile.destroy'));
  };

  return (
    <AdminLayout>
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
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                  <Tab
                    className={({ selected }) =>
                      `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                        selected
                          ? 'bg-white text-blue-700 shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
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
                          ? 'bg-white text-blue-700 shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
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
                          ? 'bg-white text-blue-700 shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center justify-center">
                      <ShieldCheckIcon className="mr-2 h-5 w-5" />
                      Roles & Permissions
                    </div>
                  </Tab>
                </Tab.List>

                <Tab.Panels className="mt-4">
                  <Tab.Panel className="rounded-xl bg-white p-6 shadow">
                    <form onSubmit={submitProfile} className="space-y-6">
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          {profileProcessing ? 'Saving...' : 'Save Profile'}
                        </button>
                      </div>
                    </form>
                  </Tab.Panel>

                  <Tab.Panel className="rounded-xl bg-white p-6 shadow">
                    <form onSubmit={submitPassword} className="space-y-6">
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="submit"
                          disabled={passwordProcessing}
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          {passwordProcessing
                            ? 'Updating...'
                            : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </Tab.Panel>

                  <Tab.Panel className="rounded-xl bg-white p-6 shadow">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Roles
                        </h3>
                        <div className="mt-2">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className="mr-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Permissions
                        </h3>
                        <div className="mt-2">
                          {user.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="mr-2 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Account Information
                        </h3>
                        <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                              Account Created
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                              {new Date(user.created_at).toLocaleDateString()}
                            </dd>
                          </div>
                          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                              Last Login
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                              {user.last_login_at
                                ? new Date(user.last_login_at).toLocaleString()
                                : 'Never'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmation(true)}
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

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
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
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={deleteAccount}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
