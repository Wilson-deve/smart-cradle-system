import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
}

export default function UpdateProfileInformationForm({
  mustVerifyEmail,
  status,
  className = '',
}: Props) {
  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      name: '',
      email: '',
    });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    patch(route('profile.update'));
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">
          Profile Information
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Update your account's profile information and email address.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
              autoComplete="username"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {mustVerifyEmail && data.email !== '' && (
          <div>
            <p className="mt-2 text-sm text-gray-800">
              Your email address is unverified.
              <button
                type="button"
                className="text-sm text-gray-600 underline hover:text-gray-900"
                onClick={() =>
                  (window.location.href = route('verification.send'))
                }
              >
                Click here to re-send the verification email.
              </button>
            </p>
            {status === 'verification-link-sent' && (
              <div className="mt-2 text-sm font-medium text-green-600">
                A new verification link has been sent to your email address.
              </div>
            )}
          </div>
        )}

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
