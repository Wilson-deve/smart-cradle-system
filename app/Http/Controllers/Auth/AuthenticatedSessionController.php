<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        session()->regenerate();

        $user = $request->user();
        \Log::info('User authenticated', [
            'id' => $user->id,
            'email' => $user->email,
            'roles' => $user->roles()->pluck('name'),
            'is_admin' => $user->isAdmin(),
            'first_role' => $user->roles->first()?->name,
        ]);
        
        // Redirect based on user role
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        } else if ($user->isParent()) {
            return redirect()->intended(route('parent.dashboard', absolute: false));
        } else if ($user->isBabysitter()) {
            return redirect()->intended(route('babysitter.dashboard', absolute: false));
        }
        
        // Default fallback
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
