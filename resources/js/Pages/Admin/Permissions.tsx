import AdminLayout from '@/Layouts/AdminLayout';
import { PermissionData, RoleData } from '@/types/roles';
import { Dialog, Transition } from '@headlessui/react';
import {
  DevicePhoneMobileIcon,
  PencilIcon,
  PlusIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { Fragment, useEffect, useState } from 'react';

interface Props {
  roles: RoleData[];
  permissions: PermissionData[];
  flash?: {
    message: string;
    type: 'success' | 'error';
  };
}

interface CreateResponse {
  message: string;
  permissions: PermissionData[];
}

interface UpdateResponse {
  message: string;
  permissions: PermissionData[];
}

export default function Permissions({
  roles: initialRoles,
  permissions,
  flash,
}: Props) {
  const [roles, setRoles] = useState<RoleData[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [activeTab, setActiveTab] = useState<
    'permissions' | 'users' | 'devices'
  >('permissions');
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
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

  useEffect(() => {
    setRoles(initialRoles);
  }, [initialRoles]);

  const handlePermissionToggle = async (permissionId: number) => {
    if (!selectedRole) return;

    try {
      await router.post(
        route('admin.permissions.toggle', {
          role: selectedRole.id,
          permission: permissionId,
        }),
        {},
        {
          preserveScroll: true,
          preserveState: true,
          onSuccess: (page) => {
            if (page.props.roles) {
              const updatedRoles = page.props.roles as RoleData[];
              setRoles(updatedRoles);
              const updatedRole = updatedRoles.find(
                (r) => r.id === selectedRole.id,
              );
              if (updatedRole) {
                setSelectedRole(updatedRole);
              }
            }
          },
        },
      );
    } catch (error) {
      console.error('Error toggling permission:', error);
    }
  };

  const handleCreatePermission = async () => {
    try {
      await router.post(route('admin.permissions.create'), formData, {
        preserveScroll: true,
        onSuccess: (page) => {
          const response = page.props as unknown as CreateResponse;
          if (response.permissions) {
            setFormData({ name: '', description: '' });
            setIsPermissionModalOpen(false);
          }
        },
      });
    } catch (error) {
      console.error('Error creating permission:', error);
    }
  };

  const handleUpdatePermission = async () => {
    if (!selectedPermission) return;

    try {
      await router.put(
        route('admin.permissions.update', selectedPermission.id),
        formData,
        {
          preserveScroll: true,
          onSuccess: (page) => {
            const response = page.props as unknown as UpdateResponse;
            if (response.permissions) {
              setFormData({ name: '', description: '' });
              setSelectedPermission(null);
              setIsEditModalOpen(false);
            }
          },
        },
      );
    } catch (error) {
      console.error('Error updating permission:', error);
    }
  };

  const handleDeletePermission = async (permissionId: number) => {
    if (!confirm('Are you sure you want to delete this permission?')) return;

    try {
      await router.delete(route('admin.permissions.delete', permissionId), {
        preserveScroll: true,
      });
    } catch (error) {
      console.error('Error deleting permission:', error);
    }
  };

  const openEditModal = (permission: PermissionData) => {
    setSelectedPermission(permission);
    setFormData({
      name: permission.name,
      description: permission.description,
    });
    setIsEditModalOpen(true);
  };

  return (
    <AdminLayout>
      <Head title="Permissions Management" />
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
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Permissions Management
                </h2>
                <button
                  onClick={() => setIsPermissionModalOpen(true)}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Add Permission
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {/* Roles List */}
                <div className="md:col-span-1">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-4 text-lg font-medium">Roles</h3>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role)}
                          className={`w-full rounded-md px-4 py-2 text-left ${
                            selectedRole?.id === role.id
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Role Details */}
                <div className="md:col-span-3">
                  {selectedRole ? (
                    <div className="rounded-lg bg-white p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          {selectedRole.name}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setActiveTab('permissions')}
                            className={`rounded-md px-3 py-1 ${
                              activeTab === 'permissions'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <ShieldCheckIcon className="mr-1 inline-block h-5 w-5" />
                            Permissions
                          </button>
                          <button
                            onClick={() => setActiveTab('users')}
                            className={`rounded-md px-3 py-1 ${
                              activeTab === 'users'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <UserIcon className="mr-1 inline-block h-5 w-5" />
                            Users
                          </button>
                          <button
                            onClick={() => setActiveTab('devices')}
                            className={`rounded-md px-3 py-1 ${
                              activeTab === 'devices'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <DevicePhoneMobileIcon className="mr-1 inline-block h-5 w-5" />
                            Devices
                          </button>
                        </div>
                      </div>

                      {activeTab === 'permissions' && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Permissions</h4>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center justify-between rounded-md border p-3"
                              >
                                <div>
                                  <p className="font-medium">
                                    {permission.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {permission.description}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      handlePermissionToggle(permission.id)
                                    }
                                    className={`rounded-md px-3 py-1 ${
                                      selectedRole.permissions?.some(
                                        (p) => p.id === permission.id,
                                      )
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {selectedRole.permissions?.some(
                                      (p) => p.id === permission.id,
                                    )
                                      ? 'Enabled'
                                      : 'Disabled'}
                                  </button>
                                  <button
                                    onClick={() => openEditModal(permission)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeletePermission(permission.id)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'users' && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Users with this role</h4>
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
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {selectedRole.users?.map((user) => (
                                  <tr key={user.id}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                      {user.name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                      {user.email}
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
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {activeTab === 'devices' && (
                        <div className="space-y-4">
                          <h4 className="font-medium">
                            Devices assigned to users with this role
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Device Name
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Assigned To
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {selectedRole.users?.flatMap((user) =>
                                  user.devices?.map((device) => (
                                    <tr key={device.id}>
                                      <td className="whitespace-nowrap px-6 py-4">
                                        {device.name}
                                      </td>
                                      <td className="whitespace-nowrap px-6 py-4">
                                        {user.name}
                                      </td>
                                      <td className="whitespace-nowrap px-6 py-4">
                                        <span
                                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            device.status === 'active'
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-red-100 text-red-800'
                                          }`}
                                        >
                                          {device.status}
                                        </span>
                                      </td>
                                    </tr>
                                  )),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      Select a role to view details
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Permission Modal */}
      <Transition appear show={isPermissionModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsPermissionModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create New Permission
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
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
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsPermissionModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={handleCreatePermission}
                    >
                      Create
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Permission Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsEditModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Edit Permission
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="edit-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="edit-description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={handleUpdatePermission}
                    >
                      Update
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </AdminLayout>
  );
}
