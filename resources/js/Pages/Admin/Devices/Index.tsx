import AdminLayout from '@/Layouts/AdminLayout';
import { Device } from '@/types/device';
import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { Fragment, useState } from 'react';

interface Props {
  devices: Device[];
  users: {
    id: number;
    name: string;
    email: string;
    role: string;
  }[];
}

interface DeviceFormData {
  [key: string]: string | number;
  name: string;
  serial_number: string;
  mac_address: string;
  ip_address: string;
  owner_id: number;
}

export default function DevicesIndex({ devices, users }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    serial_number: '',
    mac_address: '',
    ip_address: '',
    owner_id: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDevice) {
      router.put(route('admin.devices.update', editingDevice.id), formData);
    } else {
      router.post(route('admin.devices.store'), formData);
    }
    setIsModalOpen(false);
    setEditingDevice(null);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      serial_number: device.serial_number,
      mac_address: device.mac_address,
      ip_address: device.ip_address || '',
      owner_id:
        device.users.find((u) => u.pivot.relationship_type === 'owner')?.id ||
        0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (deviceId: number) => {
    if (confirm('Are you sure you want to delete this device?')) {
      router.delete(route('admin.devices.destroy', deviceId));
    }
  };

  return (
    <AdminLayout>
      <Head title="Cradle Devices" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Cradle Devices</h2>
                <button
                  onClick={() => {
                    setEditingDevice(null);
                    setFormData({
                      name: '',
                      serial_number: '',
                      mac_address: '',
                      ip_address: '',
                      owner_id: 0,
                    });
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Add Device
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Device Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {devices.map((device) => (
                      <tr key={device.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {device.name}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              device.status === 'online'
                                ? 'bg-green-100 text-green-800'
                                : device.status === 'offline'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {device.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {device.last_activity_at}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {device.users
                            .filter(
                              (user) =>
                                user.pivot.relationship_type === 'owner',
                            )
                            .map((user) => user.name)
                            .join(', ') || 'Unassigned'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => handleEdit(device)}
                            className="mr-2 text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(device.id)}
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

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {editingDevice ? 'Edit Device' : 'Add New Device'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Device Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="owner_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Assign to User
                      </label>
                      <select
                        id="owner_id"
                        value={formData.owner_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            owner_id: parseInt(e.target.value),
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email}) - {user.role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="serial_number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Serial Number
                      </label>
                      <input
                        type="text"
                        id="serial_number"
                        value={formData.serial_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            serial_number: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="mac_address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        MAC Address
                      </label>
                      <input
                        type="text"
                        id="mac_address"
                        value={formData.mac_address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mac_address: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="ip_address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        IP Address
                      </label>
                      <input
                        type="text"
                        id="ip_address"
                        value={formData.ip_address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ip_address: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      {editingDevice ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </AdminLayout>
  );
}
