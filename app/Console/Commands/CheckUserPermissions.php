<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CheckUserPermissions extends Command
{
    protected $signature = 'user:check-permissions {email}';
    protected $description = 'Check a user\'s roles and permissions';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found.");
            return 1;
        }

        $this->info("User: {$user->name} ({$user->email})");
        
        $this->info("\nRoles:");
        foreach ($user->roles as $role) {
            $this->line("- {$role->name} ({$role->slug})");
        }

        $this->info("\nPermissions:");
        $permissions = $user->getPermissions();
        foreach ($permissions as $permission) {
            $this->line("- {$permission}");
        }

        return 0;
    }
} 