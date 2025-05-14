<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ListPermissions extends Command
{
    protected $signature = 'permissions:list';
    protected $description = 'List all permissions and their role assignments';

    public function handle()
    {
        $permissions = DB::table('permissions')->get();
        
        $this->info('Permissions:');
        foreach ($permissions as $permission) {
            $this->line("- {$permission->name} ({$permission->slug})");
        }

        $this->info("\nRole-Permission Assignments:");
        $rolePermissions = DB::table('role_permission')
            ->join('roles', 'role_permission.role_id', '=', 'roles.id')
            ->join('permissions', 'role_permission.permission_id', '=', 'permissions.id')
            ->select('roles.name as role', 'permissions.slug as permission')
            ->get();

        foreach ($rolePermissions as $rp) {
            $this->line("- {$rp->role}: {$rp->permission}");
        }
    }
} 