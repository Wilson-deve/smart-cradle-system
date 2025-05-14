import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
  className?: string;
}

export default function DeleteUserForm({ className = '' }: Props) {
  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
  } = useForm({
    password: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (
      confirm(
        'Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted.',
      )
    ) {
      destroy(route('profile.destroy'), {
        preserveScroll: true,
        onSuccess: () => reset(),
      });
    }
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Delete Account</h2>
        <p className="mt-1 text-sm text-gray-600">
          Once your account is deleted, all of its resources and data will be
          permanently deleted. Before deleting your account, please download any
          data or information that you wish to retain.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="password"
              id="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 disabled:opacity-25"
          >
            Delete Account
          </button>
        </div>
      </form>
    </section>
  );
}
