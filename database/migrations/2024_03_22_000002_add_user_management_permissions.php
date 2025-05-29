<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Add user management permissions
        $permissions = [
            [
                'name' => 'View Users',
                'slug' => 'user.view',
                'description' => 'Can view users in the system',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Create Users',
                'slug' => 'user.create',
                'description' => 'Can create new users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Update Users',
                'slug' => 'user.update',
                'description' => 'Can update existing users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Delete Users',
                'slug' => 'user.delete',
                'description' => 'Can delete users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert permissions
        foreach ($permissions as $permission) {
            DB::table('permissions')->insertOrIgnore([
                'name' => $permission['name'],
                'slug' => $permission['slug'],
                'description' => $permission['description'],
                'created_at' => $permission['created_at'],
                'updated_at' => $permission['updated_at'],
            ]);
        }

        // Get admin role
        $adminRole = DB::table('roles')->where('slug', 'admin')->first();
        if ($adminRole) {
            // Get all user management permissions
            $userPermissions = DB::table('permissions')
                ->whereIn('slug', ['user.view', 'user.create', 'user.update', 'user.delete'])
                ->get();

            // Assign permissions to admin role
            foreach ($userPermissions as $permission) {
                DB::table('role_permission')->insertOrIgnore([
                    'role_id' => $adminRole->id,
                    'permission_id' => $permission->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down()
    {
        // Remove user management permissions
        DB::table('permissions')
            ->whereIn('slug', ['user.view', 'user.create', 'user.update', 'user.delete'])
            ->delete();
    }
}; 