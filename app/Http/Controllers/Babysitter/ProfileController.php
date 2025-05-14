<?php

namespace App\Http\Controllers\Babysitter;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the babysitter's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $roles = $user->roles()->pluck('name');
        $permissions = $user->getPermissions();
        $assignedDevices = $user->assignedDevices()->with('sensorReadings')->get();

        return Inertia::render('Babysitter/Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $roles,
                'permissions' => $permissions,
                'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                'last_login_at' => $user->last_login_at?->format('Y-m-d H:i:s'),
            ],
            'assignedDevices' => $assignedDevices,
            'flash' => [
                'message' => session('status'),
                'type' => session('status') ? 'success' : null,
            ],
        ]);
    }

    /**
     * Update the babysitter's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('babysitter.profile.edit')->with('status', 'Profile updated successfully.');
    }

    /**
     * Update the babysitter's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = $request->user();
        $user->password = Hash::make($request->password);
        $user->save();

        return Redirect::route('babysitter.profile.edit')->with('status', 'Password updated successfully.');
    }

    /**
     * Delete the babysitter's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/')->with('status', 'Account deleted successfully.');
    }
} 