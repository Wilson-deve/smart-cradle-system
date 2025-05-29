import { useState } from 'react';
import { Head } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { PageProps } from '@/types';
import axios from 'axios';
import {
  UserPlusIcon,
  UserMinusIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface Babysitter {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  devices: {
    id: number;
    name: string;
  }[];
  created_at: string;
}

interface Device {
  id: number;
  name: string;
  status: string;
  last_activity_at: string;
}

interface BabysittersProps extends PageProps {
  auth: {
    user: User;
  };
  babysitters: Babysitter[];
  devices: Device[];
}

export default function Babysitters({ auth, babysitters: initialBabysitters, devices }: BabysittersProps) {
  const [babysitters, setBabysitters] = useState<Babysitter[]>(initialBabysitters);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBabysitter, setSelectedBabysitter] = useState<Babysitter | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    device_ids: [] as number[],
  });

  const handleAddBabysitter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post<{ babysitter: Babysitter }>(
        route('parent.babysitters.store'),
        formData
      );
      setBabysitters([...babysitters, response.data.babysitter]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding babysitter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBabysitter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBabysitter) return;

    setIsLoading(true);
    try {
      const response = await axios.put<{ babysitter: Babysitter }>(
        route('parent.babysitters.update', selectedBabysitter.id),
        formData
      );
      setBabysitters(babysitters.map(b =>
        b.id === selectedBabysitter.id ? response.data.babysitter : b
      ));
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating babysitter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBabysitter = async (babysitterId: number) => {
    if (!confirm('Are you sure you want to remove this babysitter?')) return;

    setIsLoading(true);
    try {
      await axios.delete(route('parent.babysitters.destroy', babysitterId));
      setBabysitters(babysitters.filter(b => b.id !== babysitterId));
    } catch (error) {
      console.error('Error removing babysitter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (babysitter: Babysitter) => {
    setIsLoading(true);
    try {
      const response = await axios.put<{ babysitter: Babysitter }>(
        route('parent.babysitters.toggle-status', babysitter.id)
      );
      setBabysitters(babysitters.map(b =>
        b.id === babysitter.id ? response.data.babysitter : b
      ));
    } catch (error) {
      console.error('Error toggling babysitter status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      device_ids: [],
    });
    setSelectedBabysitter(null);
  };

  const openEditModal = (babysitter: Babysitter) => {
    setSelectedBabysitter(babysitter);
    setFormData({
      name: babysitter.name,
      email: babysitter.email,
      phone: babysitter.phone,
      device_ids: babysitter.devices.map(d => d.id),
    });
    setShowEditModal(true);
  };

  return (
    <ParentLayout user={auth.user}>
      <Head title="Babysitter Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Babysitters</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add Babysitter
            </button>
          </div>

          {/* Babysitters List */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="p-6">
              {babysitters.length > 0 ? (
                <ul role="list" className="divide-y divide-gray-200">
                  {babysitters.map((babysitter) => (
                    <li key={babysitter.id} className="py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {babysitter.name}
                          </h3>
                          <div className="mt-1 flex items-center space-x-4">
                            <p className="text-sm text-gray-500">{babysitter.email}</p>
                            <span className="text-gray-300">|</span>
                            <p className="text-sm text-gray-500">{babysitter.phone}</p>
                          </div>
                          <div className="mt-2">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              babysitter.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {babysitter.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleToggleStatus(babysitter)}
                            disabled={isLoading}
                            className={`rounded-full p-2 ${
                              babysitter.status === 'active'
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                          >
                            {babysitter.status === 'active' ? (
                              <UserMinusIcon className="h-5 w-5" />
                            ) : (
                              <UserPlusIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => openEditModal(babysitter)}
                            disabled={isLoading}
                            className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleRemoveBabysitter(babysitter.id)}
                            disabled={isLoading}
                            className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      {babysitter.devices.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-500">Assigned Devices</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {babysitter.devices.map((device) => (
                              <span
                                key={device.id}
                                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                              >
                                {device.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No babysitters</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new babysitter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {showAddModal ? 'Add Babysitter' : 'Edit Babysitter'}
                  </h3>
                  <form onSubmit={showAddModal ? handleAddBabysitter : handleEditBabysitter} className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Assign Devices
                        </label>
                        <div className="mt-2 space-y-2">
                          {devices.map((device) => (
                            <label key={device.id} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.device_ids.includes(device.id)}
                                onChange={(e) => {
                                  const newDeviceIds = e.target.checked
                                    ? [...formData.device_ids, device.id]
                                    : formData.device_ids.filter(id => id !== device.id);
                                  setFormData({ ...formData, device_ids: newDeviceIds });
                                }}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{device.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          setShowEditModal(false);
                          resetForm();
                        }}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                      >
                        {isLoading ? 'Saving...' : showAddModal ? 'Add' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ParentLayout>
  );
}
