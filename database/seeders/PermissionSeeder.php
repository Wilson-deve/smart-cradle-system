<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // Device permissions
            ['name' => 'device.create', 'slug' => 'device.create', 'description' => 'Create new devices'],
            ['name' => 'device.view', 'slug' => 'device.view', 'description' => 'View device details'],
            ['name' => 'device.update', 'slug' => 'device.update', 'description' => 'Update device information'],
            ['name' => 'device.delete', 'slug' => 'device.delete', 'description' => 'Delete devices'],
            ['name' => 'device.control', 'slug' => 'device.control', 'description' => 'Control device functions'],
            ['name' => 'device.monitor', 'slug' => 'device.monitor', 'description' => 'Monitor device status'],
            
            // User management permissions
            ['name' => 'user.create', 'slug' => 'user.create', 'description' => 'Create new users'],
            ['name' => 'user.view', 'slug' => 'user.view', 'description' => 'View user details'],
            ['name' => 'user.update', 'slug' => 'user.update', 'description' => 'Update user information'],
            ['name' => 'user.delete', 'slug' => 'user.delete', 'description' => 'Delete users'],
            
            // Role management permissions
            ['name' => 'role.create', 'slug' => 'role.create', 'description' => 'Create new roles'],
            ['name' => 'role.view', 'slug' => 'role.view', 'description' => 'View role details'],
            ['name' => 'role.update', 'slug' => 'role.update', 'description' => 'Update role information'],
            ['name' => 'role.delete', 'slug' => 'role.delete', 'description' => 'Delete roles'],
            
            // Monitoring permissions
            ['name' => 'monitoring.view', 'slug' => 'monitoring.view', 'description' => 'View monitoring dashboard'],
            ['name' => 'monitoring.control', 'slug' => 'monitoring.control', 'description' => 'Control monitoring features'],
            ['name' => 'monitoring.alerts', 'slug' => 'monitoring.alerts', 'description' => 'View and manage alerts'],
            
            // System permissions
            ['name' => 'system.settings', 'slug' => 'system.settings', 'description' => 'Manage system settings'],
            ['name' => 'system.logs', 'slug' => 'system.logs', 'description' => 'View system logs'],
            ['name' => 'system.backup', 'slug' => 'system.backup', 'description' => 'Manage system backups'],
            
            // Alert permissions
            ['name' => 'Manage Alerts', 'slug' => 'manage_alerts', 'description' => 'Full access to manage alerts'],
            ['name' => 'View Alerts', 'slug' => 'view_alerts', 'description' => 'View alerts only'],
        ];

        foreach ($permissions as $permission) {
            $permission['created_at'] = now();
            $permission['updated_at'] = now();
            DB::table('permissions')->updateOrInsert(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
} 