<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);
        
        $users = User::with('roles')->get();
        
        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $this->authorize('create', User::class);
        
        $roles = Role::all();
        
        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|exists:roles,name',
        ]);
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        
        $user->assignRole($validated['role']);
        
        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        
        $user->load('roles', 'devices');
        
        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $this->authorize('update', $user);
        
        $roles = Role::all();
        
        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|exists:roles,name',
        ]);
        
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);
        
        // Update role
        $user->syncRoles([$validated['role']]);
        
        return redirect()->route('users.show', $user)
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        
        // Prevent self-deletion
        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }
        
        $user->delete();
        
        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request, User $user)
    {
        $this->authorize('update', $user);
        
        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);
        
        return back()->with('success', 'Password updated successfully.');
    }

    /**
     * Assign a role to a user.
     */
    public function assignRole(Request $request, User $user)
    {
        $this->authorize('manageRoles', User::class);
        
        $validated = $request->validate([
            'role' => 'required|exists:roles,name',
        ]);
        
        $user->assignRole($validated['role']);
        
        return back()->with('success', 'Role assigned successfully.');
    }

    /**
     * Remove a role from a user.
     */
    public function removeRole(Request $request, User $user)
    {
        $this->authorize('manageRoles', User::class);
        
        $validated = $request->validate([
            'role' => 'required|exists:roles,name',
        ]);
        
        $user->removeRole($validated['role']);
        
        return back()->with('success', 'Role removed successfully.');
    }
} 