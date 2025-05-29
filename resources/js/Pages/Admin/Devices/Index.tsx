import AdminLayout from '@/Layouts/AdminLayout';
import { Device, DeviceUser } from '@/types/device';
import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import { PageProps } from '@/types';

// FormDataConvertible type definition
type FormDataConvertible = string | number | boolean | null;

interface Props extends PageProps {
  devices: (Device & {
    can?: {
      update: boolean;
      delete: boolean;
      manage_users: boolean;
    };
  })[];
  users: {
    id: number;
    name: string;
    email: string;
    role: string;
  }[];
  can: {
    create: boolean;
  };
}

interface DeviceFormErrors {
  name?: string;
  serial_number?: string;
  mac_address?: string;
  ip_address?: string;
  owner_id?: string;
}

interface DeviceFormData extends Record<string, FormDataConvertible> {
  name: string;
  serial_number: string;
  mac_address: string;
  ip_address: string;
  owner_id: number;
  status: 'online' | 'offline' | 'maintenance';
}

const initialFormData: DeviceFormData = {
  name: '',
  serial_number: '',
  mac_address: '',
  ip_address: '',
  owner_id: 0,
  status: 'offline',
};

export default function DevicesIndex({ devices, users, can, auth }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>(initialFormData);
  const [errors, setErrors] = useState<DeviceFormErrors>({});
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: DeviceFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Device name is required';
    }

    if (!formData.serial_number.trim()) {
      newErrors.serial_number = 'Serial number is required';
    }

    if (!formData.mac_address.trim()) {
      newErrors.mac_address = 'MAC address is required';
    } else if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(formData.mac_address)) {
      newErrors.mac_address = 'Invalid MAC address format';
    }

    if (!formData.ip_address.trim()) {
      newErrors.ip_address = 'IP address is required';
    } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ip_address)) {
      newErrors.ip_address = 'Invalid IP address format';
    }

    if (!formData.owner_id) {
      newErrors.owner_id = 'Owner is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingDevice) {
      router.put(route('admin.devices.update', editingDevice.id), formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingDevice(null);
          setFormData(initialFormData);
          setErrors({});
          setFlashMessage({ type: 'success', message: 'Device updated successfully' });
          setTimeout(() => setFlashMessage(null), 3000);
        },
        onError: (errors: any) => {
          setErrors(errors);
          setFlashMessage({ type: 'error', message: 'Failed to update device. Please check the form for errors.' });
          setTimeout(() => setFlashMessage(null), 3000);
        },
        preserveScroll: true,
      });
    } else {
      router.post(route('admin.devices.store'), formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData(initialFormData);
          setErrors({});
          setFlashMessage({ type: 'success', message: 'Device created successfully' });
          setTimeout(() => setFlashMessage(null), 3000);
        },
        onError: (errors: any) => {
          setErrors(errors);
          setFlashMessage({ type: 'error', message: 'Failed to create device. Please check the form for errors.' });
          setTimeout(() => setFlashMessage(null), 3000);
        },
        preserveScroll: true,
      });
    }
  };

  const handleEdit = async (device: Device) => {
    try {
      const response = await fetch(`/admin/devices/${device.id}`);
      if (response.status === 403) {
        const data = await response.json();
        alert(data.message || 'You do not have permission to edit this device');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch device details');
      }
      
      const data = await response.json();
      const deviceData = data.device as Device;
      const permissions = data.can;

      if (!permissions.update) {
        alert('You do not have permission to edit this device');
        return;
      }

      setEditingDevice(deviceData);
      setFormData({
        name: deviceData.name,
        serial_number: deviceData.serial_number,
        mac_address: deviceData.mac_address,
        ip_address: deviceData.ip_address || '',
        status: deviceData.status,
        owner_id: deviceData.users.find((u) => u.pivot.relationship_type === 'owner')?.id || 0,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching device details:', error);
      alert('Failed to load device details. Please try again.');
    }
  };

  const handleDelete = async (deviceId: number) => {
    try {
      const response = await fetch(`/admin/devices/${deviceId}`);
      if (response.status === 403) {
        const data = await response.json();
        alert(data.message || 'You do not have permission to delete this device');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch device details');
      }
      
      const data = await response.json();
      if (!data.can.delete) {
        alert('You do not have permission to delete this device');
        return;
      }

      if (confirm('Are you sure you want to delete this device?')) {
        router.delete(route('admin.devices.destroy', deviceId), {
          onSuccess: () => {
            // The page will automatically refresh
          },
          onError: (errors) => {
            alert('Failed to delete device. Please try again.');
          },
        });
      }
    } catch (error) {
      console.error('Error checking delete permission:', error);
      alert('Failed to verify permissions. Please try again.');
    }
  };

  return (
    <AdminLayout user={auth.user}>
      <Head title="Cradle Devices" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Flash Message */}
          {flashMessage && (
            <div className={`mb-4 rounded-md p-4 ${
              flashMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <XMarkIcon
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => setFlashMessage(null)}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{flashMessage.message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Cradle Devices</h2>
                <button
                  onClick={() => {
                    setEditingDevice(null);
                    setFormData(initialFormData);
                    setErrors({});
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900"
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
                            .filter((user) => user.pivot.relationship_type === 'owner')
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

            <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {editingDevice ? 'Edit Device' : 'Add New Device'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Device Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        id="serial_number"
                        value={formData.serial_number}
                        onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.serial_number
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        required
                      />
                      {errors.serial_number && (
                        <p className="mt-1 text-sm text-red-600">{errors.serial_number}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="mac_address" className="block text-sm font-medium text-gray-700">
                        MAC Address
                      </label>
                      <input
                        type="text"
                        id="mac_address"
                        value={formData.mac_address}
                        onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                        placeholder="00:11:22:33:44:55"
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.mac_address
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        required
                      />
                      {errors.mac_address && (
                        <p className="mt-1 text-sm text-red-600">{errors.mac_address}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="ip_address" className="block text-sm font-medium text-gray-700">
                        IP Address
                      </label>
                      <input
                        type="text"
                        id="ip_address"
                        value={formData.ip_address}
                        onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                        placeholder="192.168.1.1"
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.ip_address
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        required
                      />
                      {errors.ip_address && (
                        <p className="mt-1 text-sm text-red-600">{errors.ip_address}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">
                        Assign to User
                      </label>
                      <select
                        id="owner_id"
                        value={formData.owner_id}
                        onChange={(e) => setFormData({ ...formData, owner_id: Number(e.target.value) })}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.owner_id
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        required
                      >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email}) - {user.role}
                          </option>
                        ))}
                      </select>
                      {errors.owner_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.owner_id}</p>
                      )}
                    </div>

                    {editingDevice && (
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value as 'online' | 'offline' | 'maintenance',
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setErrors({});
                      }}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
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
