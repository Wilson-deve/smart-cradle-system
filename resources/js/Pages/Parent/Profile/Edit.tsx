import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props extends PageProps {
  mustVerifyEmail: boolean;
  status?: string;
}

export default function Edit({ auth, mustVerifyEmail, status }: Props) {
  if (!auth.user) {
    return null; // or return a loading state or redirect
  }

  const [showSuccessMessage, setShowSuccessMessage] = useState(!!status);

  const { data, setData, patch, errors, processing, reset, delete: destroy } = useForm({
    name: auth.user.name,
    email: auth.user.email,
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('parent.profile.update'), {
      onSuccess: () => {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      },
    });
  };

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('parent.profile.password'), {
      preserveScroll: true,
      onSuccess: () => {
        reset('current_password', 'password', 'password_confirmation');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      },
    });
  };

  const deleteAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      destroy(route('parent.profile.destroy'));
    }
  };

  return (
    <ParentLayout user={auth.user}>
      <Head title="Profile" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Success Message */}
          <Transition
            show={showSuccessMessage}
            enter="transition ease-out duration-300"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition ease-in duration-200"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <div className="fixed top-4 right-4 z-50">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> Your changes have been saved.</span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setShowSuccessMessage(false)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Transition>

          {/* Profile Information */}
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <section className="max-w-xl">
              <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Update your account's profile information and email address.
                </p>
              </header>

              <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {mustVerifyEmail && (
                  <div>
                    <p className="text-sm mt-2 text-gray-800">
                      Your email address is unverified.
                      <button
                        type="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => route('verification.send')}
                      >
                        Click here to re-send the verification email.
                      </button>
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Update Password */}
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <section className="max-w-xl">
              <header>
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Ensure your account is using a long, random password to stay secure.
                </p>
              </header>

              <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    id="current_password"
                    type="password"
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.current_password && (
                    <p className="mt-2 text-sm text-red-600">{errors.current_password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.password_confirmation && (
                    <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Delete Account */}
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <section className="max-w-xl">
              <header>
                <h2 className="text-lg font-medium text-gray-900">Delete Account</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Once your account is deleted, all of its resources and data will be permanently deleted.
                </p>
              </header>

              <form onSubmit={deleteAccount} className="mt-6">
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
