<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BabysitterSeeder extends Seeder
{
    public function run()
    {
        // Get babysitter role
        $babysitterRole = DB::table('roles')->where('slug', 'babysitter')->first();
        
        if (!$babysitterRole) {
            return;
        }

        // Sample babysitters data
        $babysitters = [
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@example.com',
                'phone' => '+1234567890',
                'experience_years' => 3,
                'certifications' => json_encode(['CPR', 'First Aid', 'Child Care']),
                'availability' => json_encode([
                    'monday' => ['09:00-17:00'],
                    'wednesday' => ['09:00-17:00'],
                    'friday' => ['09:00-17:00']
                ])
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael.chen@example.com',
                'phone' => '+1234567891',
                'experience_years' => 5,
                'certifications' => json_encode(['CPR', 'First Aid', 'Early Childhood Education']),
                'availability' => json_encode([
                    'tuesday' => ['10:00-18:00'],
                    'thursday' => ['10:00-18:00'],
                    'saturday' => ['09:00-15:00']
                ])
            ],
            [
                'name' => 'Emma Davis',
                'email' => 'emma.davis@example.com',
                'phone' => '+1234567892',
                'experience_years' => 2,
                'certifications' => json_encode(['CPR', 'Child Care Safety']),
                'availability' => json_encode([
                    'monday' => ['14:00-22:00'],
                    'wednesday' => ['14:00-22:00'],
                    'friday' => ['14:00-22:00']
                ])
            ]
        ];

        foreach ($babysitters as $babysitter) {
            // Create user account
            $userId = DB::table('users')->insertGetId([
                'name' => $babysitter['name'],
                'email' => $babysitter['email'],
                'password' => Hash::make('password'), // Default password
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Assign babysitter role
            DB::table('role_user')->insert([
                'user_id' => $userId,
                'role_id' => $babysitterRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create babysitter profile
            DB::table('babysitter_profiles')->insert([
                'user_id' => $userId,
                'phone' => $babysitter['phone'],
                'experience_years' => $babysitter['experience_years'],
                'certifications' => $babysitter['certifications'],
                'availability' => $babysitter['availability'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
} 