import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

interface Props extends PageProps {
  mustVerifyEmail: boolean;
  status?: string;
  user: {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
  flash?: {
    message: string;
    type: 'success' | 'error';
  };
}

export default function Edit({ mustVerifyEmail, status, user, flash }: Props) {
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (flash?.message) {
      setShowFlash(true);
      const timer = setTimeout(() => {
        setShowFlash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Profile
        </h2>
      }
    >
      <Head title="Profile" />

      {showFlash && flash && (
        <div className="fixed right-4 top-4 z-50">
          <div
            className={`rounded-md p-4 ${
              flash.type === 'success' ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <p
                  className={`text-sm ${
                    flash.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {flash.message}
                </p>
              </div>
              <div className="ml-3">
                <button
                  type="button"
                  className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={() => setShowFlash(false)}
                >
                  <span className="sr-only">Dismiss</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl"
            />
          </div>

          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
            <UpdatePasswordForm className="max-w-xl" />
          </div>

          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
            <DeleteUserForm className="max-w-xl" />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
