import AdminLayout from '@/Layouts/AdminLayout';
import { Role, User } from '@/types/roles';
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
  users: (User & { roles: Role[] })[];
  roles: Role[];
}

export default function Users({ users, roles }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      router.put(route('admin.users.update', selectedUser.id), formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setFormData({ name: '', email: '', password: '', roles: [] });
        },
      });
    } else {
      router.post(route('admin.users.store'), formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({ name: '', email: '', password: '', roles: [] });
        },
      });
    }
  };

  const handleDelete = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      router.delete(route('admin.users.destroy', userId));
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      roles: user.roles?.map((role) => role.name) || [],
    });
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <Head title="Users Management" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Users Management</h2>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      roles: [],
                    });
                    setIsModalOpen(true);
                  }}
                  className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white"
                >
                  <UserPlusIcon className="mr-2 h-5 w-5" />
                  Add User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Roles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {user.roles.map((role) => (
                            <span
                              key={role.id}
                              className="mr-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                            >
                              {role.name}
                            </span>
                          ))}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => openEditModal(user)}
                            className="mr-3 text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">
              {selectedUser ? 'Edit User' : 'Add User'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required={!selectedUser}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Roles
                </label>
                <div className="mt-2 space-y-2">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.roles.includes(role.name)}
                        onChange={(e) => {
                          const newRoles = e.target.checked
                            ? [...formData.roles, role.name]
                            : formData.roles.filter((r) => r !== role.name);
                          setFormData({ ...formData, roles: newRoles });
                        }}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <span className="ml-2">{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  {selectedUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
