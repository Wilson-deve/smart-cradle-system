<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // First, create roles and permissions
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,
            
            // Then create users (admin, parent, babysitter)
            UserSeeder::class,
            BabysitterSeeder::class,
            
            // Create basic device data
            DeviceSeeder::class,
            
            // Create minimal alerts
            AlertSeeder::class,
        ]);
    }
}
