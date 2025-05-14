<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $roles = Role::with(['permissions', 'users.devices'])->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/Permissions', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function togglePermission(Role $role, Permission $permission)
    {
        // Check if the role has the permission using a direct query
        $hasPermission = $role->permissions()->where('permissions.id', $permission->id)->exists();
        
        if ($hasPermission) {
            $role->permissions()->detach($permission);
            $message = 'Permission removed successfully';
        } else {
            $role->permissions()->attach($permission);
            $message = 'Permission added successfully';
        }

        // Reload all roles with their permissions
        $roles = Role::with(['permissions', 'users.devices'])->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/Permissions', [
            'roles' => $roles,
            'permissions' => $permissions,
            'flash' => [
                'message' => $message,
                'type' => 'success',
            ],
        ]);
    }

    public function createPermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'description' => 'required|string',
        ]);

        $permission = Permission::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Permission created successfully',
            'permission' => $permission,
        ]);
    }

    public function updatePermission(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'description' => 'required|string',
        ]);

        $permission->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Permission updated successfully',
            'permission' => $permission,
        ]);
    }

    public function deletePermission(Permission $permission)
    {
        $permission->delete();

        return response()->json([
            'message' => 'Permission deleted successfully',
        ]);
    }
} 