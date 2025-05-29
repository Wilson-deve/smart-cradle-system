import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import ParentLayout from '@/Layouts/ParentLayout';
import { PageProps, User } from '@/types';

type NotificationLevel = 'all' | 'important' | 'none';
type AlertThreshold = 'low' | 'medium' | 'high';
type CameraQuality = 'low' | 'medium' | 'high';
type StreamRetention = '12 hours' | '24 hours' | '48 hours' | '72 hours';
type DataSharing = 'minimal' | 'moderate' | 'full';
type CameraAccess = 'authorized_only' | 'all_babysitters' | 'family_only';

type FormDataConvertible = string | number | boolean | null | Blob | File | Date;

interface FormData {
  [key: string]: FormDataConvertible | Record<string, FormDataConvertible> | FormDataConvertible[];
  notifications: {
    email_notifications: NotificationLevel;
    push_notifications: NotificationLevel;
    alert_threshold: AlertThreshold;
  };
  monitoring: {
    camera_quality: CameraQuality;
    stream_retention: StreamRetention;
  };
  privacy: {
    data_sharing: DataSharing;
    camera_access: CameraAccess;
  };
}

interface Props extends PageProps {
  settings: FormData;
  auth: {
    user: User;
  };
}

export default function Settings({ auth, settings }: Props) {
  const form = useForm<FormData>(settings);
  const { data, setData, post, processing } = form;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('parent.settings.update'));
  };

  const updateSettings = (section: keyof FormData, field: string, value: string) => {
    const updatedData = { ...data };
    (updatedData[section] as Record<string, string>)[field] = value;
    setData(updatedData);
  };

  return (
    <ParentLayout user={auth.user}>
      <Head title="Settings" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="mb-6 text-xl font-semibold">Parent Settings</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Notification Settings */}
                <div>
                  <h3 className="mb-4 text-lg font-medium">Notification Settings</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email_notifications" className="block text-sm font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <select
                        id="email_notifications"
                        value={data.notifications.email_notifications}
                        onChange={(e) => updateSettings('notifications', 'email_notifications', e.target.value as NotificationLevel)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="all">All Notifications</option>
                        <option value="important">Important Only</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="push_notifications" className="block text-sm font-medium text-gray-700">
                        Push Notifications
                      </label>
                      <select
                        id="push_notifications"
                        value={data.notifications.push_notifications}
                        onChange={(e) => updateSettings('notifications', 'push_notifications', e.target.value as NotificationLevel)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="all">All Notifications</option>
                        <option value="important">Important Only</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="alert_threshold" className="block text-sm font-medium text-gray-700">
                        Alert Threshold
                      </label>
                      <select
                        id="alert_threshold"
                        value={data.notifications.alert_threshold}
                        onChange={(e) => updateSettings('notifications', 'alert_threshold', e.target.value as AlertThreshold)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Monitoring Settings */}
                <div>
                  <h3 className="mb-4 text-lg font-medium">Monitoring Settings</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="camera_quality" className="block text-sm font-medium text-gray-700">
                        Camera Quality
                      </label>
                      <select
                        id="camera_quality"
                        value={data.monitoring.camera_quality}
                        onChange={(e) => updateSettings('monitoring', 'camera_quality', e.target.value as CameraQuality)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="low">Low (480p)</option>
                        <option value="medium">Medium (720p)</option>
                        <option value="high">High (1080p)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="stream_retention" className="block text-sm font-medium text-gray-700">
                        Stream Retention
                      </label>
                      <select
                        id="stream_retention"
                        value={data.monitoring.stream_retention}
                        onChange={(e) => updateSettings('monitoring', 'stream_retention', e.target.value as StreamRetention)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="12 hours">12 hours</option>
                        <option value="24 hours">24 hours</option>
                        <option value="48 hours">48 hours</option>
                        <option value="72 hours">72 hours</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h3 className="mb-4 text-lg font-medium">Privacy Settings</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="data_sharing" className="block text-sm font-medium text-gray-700">
                        Data Sharing
                      </label>
                      <select
                        id="data_sharing"
                        value={data.privacy.data_sharing}
                        onChange={(e) => updateSettings('privacy', 'data_sharing', e.target.value as DataSharing)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="minimal">Minimal</option>
                        <option value="moderate">Moderate</option>
                        <option value="full">Full</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="camera_access" className="block text-sm font-medium text-gray-700">
                        Camera Access
                      </label>
                      <select
                        id="camera_access"
                        value={data.privacy.camera_access}
                        onChange={(e) => updateSettings('privacy', 'camera_access', e.target.value as CameraAccess)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="authorized_only">Authorized Only</option>
                        <option value="all_babysitters">All Babysitters</option>
                        <option value="family_only">Family Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {processing ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
} 