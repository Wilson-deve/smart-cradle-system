<?php

namespace App\Console\Commands;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

class SetupAdminPermissions extends Command
{
    protected $signature = 'admin:setup-permissions';
    protected $description = 'Setup admin permissions';

    public function handle()
    {
        $this->info('Setting up admin permissions...');

        // Create or get the manage_alerts permission
        $permission = Permission::firstOrCreate(
            ['slug' => 'manage_alerts'],
            [
                'name' => 'Manage Alerts',
                'description' => 'Can manage system alerts'
            ]
        );

        // Get or create admin role
        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Administrator',
                'description' => 'System Administrator'
            ]
        );

        // Ensure the admin role has the manage_alerts permission
        if (!$adminRole->hasPermission('manage_alerts')) {
            $adminRole->givePermissionTo($permission);
            $this->info('Added manage_alerts permission to admin role');
        }

        $this->info('Admin permissions setup completed successfully');
    }
} 