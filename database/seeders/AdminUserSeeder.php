<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Check if admin user already exists
        $admin = User::where('email', 'admin@example.com')->first();

        if (!$admin) {
            // Create admin user if it doesn't exist
            $admin = User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]);
        }

        // Ensure admin has the admin role
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }
    }
} 