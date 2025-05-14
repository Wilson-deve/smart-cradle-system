<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Clear existing relationships first
         $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@babycradle.com',
            'password' => hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Create Parents
        User::factory(5)->create()->each(function ($user) {
            $user->assignRole('parent');
            // Create baby profile for each parent
            $user->babyProfile()->create([
                'name' => fake()->firstName(),
                'birth_date' => fake()->dateTimeBetween('-2 years', '-3 months'),
                'gender' => fake()->randomElement(['male', 'female']),
            ]);
        });

        // Create Babysitters
        User::factory(3)->create()->each(function ($user) {
            $user->assignRole('babysitter');
        });

    }
}
