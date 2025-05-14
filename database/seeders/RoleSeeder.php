<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'System administrator with full access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Parent',
                'slug' => 'parent',
                'description' => 'Parent with device management and monitoring access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Babysitter',
                'slug' => 'babysitter',
                'description' => 'Babysitter with limited monitoring access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
} 