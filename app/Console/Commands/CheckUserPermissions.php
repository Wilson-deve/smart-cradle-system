<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CheckUserPermissions extends Command
{
    protected $signature = 'user:check-permissions {email : The email of the user to check}';
    protected $description = 'Check a user\'s roles and permissions';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found.");
            return 1;
        }

        // Display user info
        $this->info("\nUser Information:");
        $this->table(['Name', 'Email', 'Status'], [
            [$user->name, $user->email, $user->status]
        ]);

        // Display roles
        $this->info("\nRoles:");
        $roles = $user->roles()->get(['name', 'slug'])->toArray();
        $this->table(['Name', 'Slug'], $roles);

        // Display permissions
        $this->info("\nPermissions:");
        $permissions = $user->roles()
            ->with('permissions')
            ->get()
            ->pluck('permissions')
            ->flatten()
            ->unique('id')
            ->map(function ($permission) {
                return [
                    $permission->name,
                    $permission->slug,
                    $permission->description
                ];
            })
            ->toArray();

        $this->table(['Name', 'Slug', 'Description'], $permissions);

        // Check specific monitoring permissions
        $this->info("\nMonitoring Permissions Check:");
        $monitoringPermissions = [
            'monitoring.view',
            'device.monitor',
            'device.health',
            'monitoring.control',
            'monitoring.alerts'
        ];

        foreach ($monitoringPermissions as $permission) {
            $hasPermission = $user->hasPermission($permission);
            $this->line(sprintf(
                '%s: %s',
                $permission,
                $hasPermission ? '<fg=green>✓</>' : '<fg=red>✗</>'
            ));
        }

        // Check device access
        $this->info("\nDevice Access:");
        $devices = $user->devices()
            ->with('pivot')
            ->get()
            ->map(function ($device) {
                return [
                    $device->id,
                    $device->name,
                    $device->pivot->relationship_type,
                    json_encode($device->pivot->permissions)
                ];
            })
            ->toArray();

        if (count($devices) > 0) {
            $this->table(['ID', 'Name', 'Relationship', 'Permissions'], $devices);
        } else {
            $this->warn('No devices assigned to this user.');
        }

        return 0;
    }
} 