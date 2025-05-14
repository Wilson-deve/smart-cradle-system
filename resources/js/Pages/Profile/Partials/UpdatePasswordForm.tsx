import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
  className?: string;
}

export default function UpdatePasswordForm({ className = '' }: Props) {
  const { data, setData, put, errors, reset, processing, recentlySuccessful } =
    useForm({
      current_password: '',
      password: '',
      password_confirmation: '',
    });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
        <p className="mt-1 text-sm text-gray-600">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <label
            htmlFor="current_password"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="current_password"
              id="current_password"
              value={data.current_password}
              onChange={(e) => setData('current_password', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              autoComplete="current-password"
            />
          </div>
          {errors.current_password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.current_password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="password"
              id="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              autoComplete="new-password"
            />
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              autoComplete="new-password"
            />
          </div>
          {errors.password_confirmation && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-700 disabled:opacity-25"
          >
            Save
          </button>

          {recentlySuccessful && (
            <p className="text-sm text-gray-600">Saved.</p>
          )}
        </div>
      </form>
    </section>
  );
}
