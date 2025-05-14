import RoleBasedLayout from '@/Layouts/RoleBasedLayout';
import { User } from '@/types/roles';
import { Head } from '@inertiajs/react';
import React from 'react';

interface MediaProps {
  auth: {
    user: User;
  };
}

const Media: React.FC<MediaProps> = ({ auth }) => {
  const { user } = auth;

  return (
    <RoleBasedLayout user={user}>
      <Head title="Lullabies & Media" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <h1 className="mb-4 text-2xl font-bold">Lullabies & Media</h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-xl font-semibold">Lullabies</h2>
                  {/* Add lullaby controls here */}
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-xl font-semibold">Projector</h2>
                  {/* Add projector controls here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default Media;
