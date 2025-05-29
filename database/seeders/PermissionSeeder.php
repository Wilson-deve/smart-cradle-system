<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // User Management Permissions
            [
                'name' => 'View Users',
                'slug' => 'user.view',
                'description' => 'Can view users in the system'
            ],
            [
                'name' => 'Create Users',
                'slug' => 'user.create',
                'description' => 'Can create new users'
            ],
            [
                'name' => 'Update Users',
                'slug' => 'user.update',
                'description' => 'Can update existing users'
            ],
            [
                'name' => 'Delete Users',
                'slug' => 'user.delete',
                'description' => 'Can delete users'
            ],

            // Device Management Permissions
            [
                'name' => 'View Devices',
                'slug' => 'device.view',
                'description' => 'Can view devices'
            ],
            [
                'name' => 'Create Devices',
                'slug' => 'device.create',
                'description' => 'Can create new devices'
            ],
            [
                'name' => 'Update Devices',
                'slug' => 'device.update',
                'description' => 'Can update devices'
            ],
            [
                'name' => 'Delete Devices',
                'slug' => 'device.delete',
                'description' => 'Can delete devices'
            ],
            [
                'name' => 'Control Devices',
                'slug' => 'device.control',
                'description' => 'Can control devices'
            ],

            // Monitoring Permissions
            [
                'name' => 'View Monitoring',
                'slug' => 'monitoring.view',
                'description' => 'Can access monitoring dashboard'
            ],
            [
                'name' => 'Monitor Devices',
                'slug' => 'device.monitor',
                'description' => 'Can monitor device data and camera feeds'
            ],
            [
                'name' => 'View Device Health',
                'slug' => 'device.health',
                'description' => 'Can view device health analytics'
            ],
            [
                'name' => 'Control Monitoring',
                'slug' => 'monitoring.control',
                'description' => 'Can control monitoring features'
            ],

            // Alert Permissions
            [
                'name' => 'View System Alerts',
                'slug' => 'alerts.view',
                'description' => 'Can view system alerts'
            ],
            [
                'name' => 'Manage System Alerts',
                'slug' => 'alerts.manage',
                'description' => 'Can manage system alerts'
            ],
            [
                'name' => 'Update Alert Settings',
                'slug' => 'alerts.update',
                'description' => 'Can update alert settings'
            ],

            // System Permissions
            [
                'name' => 'Manage Settings',
                'slug' => 'system.settings',
                'description' => 'Can manage system settings'
            ],
            [
                'name' => 'View System Logs',
                'slug' => 'system.logs',
                'description' => 'Can view system logs'
            ],
            [
                'name' => 'Manage Backups',
                'slug' => 'system.backup',
                'description' => 'Can manage system backups'
            ],
        ];

        // Insert or update permissions
        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['slug' => $permission['slug']], // Match by slug
                array_merge($permission, [
                    'updated_at' => now(),
                    'created_at' => DB::raw('COALESCE(created_at, NOW())'),
                ])
            );
        }
    }
} 