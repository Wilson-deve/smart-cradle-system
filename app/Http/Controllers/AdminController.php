<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\User;
use App\Models\SystemLog;
use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => User::count(),
                'devices' => Device::count(),
                'activeDevices' => Device::where('status', 'active')->count(),
            ]
        ]);
    }

    public function userManagement()
    {
        return Inertia::render('Admin/UserManagement', [
            'users' => User::with('roles')->get()
        ]);
    }

    public function deviceManagement()
    {
        return Inertia::render('Admin/DeviceManagement', [
            'devices' => Device::with('users')->get()
        ]);
    }

    public function systemLogs()
    {
        return Inertia::render('Admin/SystemLogs');
    }

    public function alerts()
    {
        return Inertia::render('Admin/Alerts', [
            'alerts' => [
                'data' => Alert::with('device')->latest()->get(),
                'current_page' => 1,
                'last_page' => 1,
                'total' => Alert::count()
            ]
        ]);
    }

    public function systemHealth()
    {
        return Inertia::render('Admin/SystemHealth');
    }

    public function settings()
    {
        return Inertia::render('Admin/Settings');
    }

    public function permissions()
    {
        // This is a placeholder. In a real application, you would fetch roles and permissions from the database
        $roles = [
            [
                'id' => 1,
                'name' => 'Admin',
                'permissions' => ['manage_users', 'manage_devices', 'manage_settings', 'view_logs'],
                'users_count' => 3
            ],
            [
                'id' => 2,
                'name' => 'Parent',
                'permissions' => ['view_devices', 'control_cradle', 'view_reports'],
                'users_count' => 5
            ],
            [
                'id' => 3,
                'name' => 'Babysitter',
                'permissions' => ['view_devices', 'control_cradle'],
                'users_count' => 2
            ]
        ];

        $permissions = [
            [
                'id' => 1,
                'name' => 'manage_users',
                'description' => 'Can create, edit, and delete users',
                'roles' => ['Admin']
            ],
            [
                'id' => 2,
                'name' => 'manage_devices',
                'description' => 'Can create, edit, and delete devices',
                'roles' => ['Admin']
            ],
            [
                'id' => 3,
                'name' => 'manage_settings',
                'description' => 'Can modify system settings',
                'roles' => ['Admin']
            ],
            [
                'id' => 4,
                'name' => 'view_logs',
                'description' => 'Can view system logs',
                'roles' => ['Admin']
            ],
            [
                'id' => 5,
                'name' => 'view_devices',
                'description' => 'Can view assigned devices',
                'roles' => ['Admin', 'Parent', 'Babysitter']
            ],
            [
                'id' => 6,
                'name' => 'control_cradle',
                'description' => 'Can control cradle functions',
                'roles' => ['Parent', 'Babysitter']
            ],
            [
                'id' => 7,
                'name' => 'view_reports',
                'description' => 'Can view health reports',
                'roles' => ['Parent']
            ]
        ];

        return Inertia::render('Admin/Permissions', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }
}
