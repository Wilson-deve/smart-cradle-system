import RoleBasedLayout from '@/Layouts/RoleBasedLayout';
import { User } from '@/types/roles';
import { Head } from '@inertiajs/react';
import React from 'react';

interface BabysittersProps {
  auth: {
    user: User;
  };
}

const Babysitters: React.FC<BabysittersProps> = ({ auth }) => {
  const { user } = auth;

  return (
    <RoleBasedLayout user={user}>
      <Head title="Babysitter Management" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <h1 className="mb-4 text-2xl font-bold">Babysitter Management</h1>
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-xl font-semibold">
                    Assigned Babysitters
                  </h2>
                  {/* Add babysitter list here */}
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-xl font-semibold">
                    Invite Babysitter
                  </h2>
                  {/* Add invite form here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default Babysitters;
