<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\Device;
use App\Models\DeviceSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory;

class UserSeeder extends Seeder
{
    protected $faker;

    public function __construct()
    {
        $this->faker = Factory::create();
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'status' => 'active',
            ]
        );

        // Ensure admin has the admin role
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        // Create parent users
        $parents = [
            [
                'email' => 'parent@example.com',
                'name' => 'Test Parent',
            ],
            [
                'email' => 'parent2@example.com',
                'name' => 'Test Parent 2',
            ],
        ];

        foreach ($parents as $parentData) {
            $parent = User::firstOrCreate(
                ['email' => $parentData['email']],
                [
                    'name' => $parentData['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'status' => 'active',
                ]
            );

            // Ensure parent has the parent role
            if (!$parent->hasRole('parent')) {
                $parent->assignRole('parent');
            }

            // Only create a device if the parent doesn't have one
            if ($parent->devices()->count() === 0) {
                $device = Device::create([
                    'name' => $parentData['name'] . "'s Cradle",
                    'serial_number' => 'CRDL-' . strtoupper(substr(md5($parentData['email']), 0, 8)),
                    'mac_address' => $this->faker->unique()->macAddress(),
                    'ip_address' => $this->faker->localIpv4(),
                    'status' => 'online',
                    'last_activity_at' => now(),
                ]);

                // Create device settings
                DeviceSetting::create([
                    'device_id' => $device->id,
                    'is_swinging' => false,
                    'swing_speed' => 3,
                    'is_playing_music' => false,
                    'volume' => 50,
                    'is_projector_on' => false,
                ]);

                // Attach the device to the parent
                $parent->devices()->attach($device->id, [
                    'relationship_type' => 'owner',
                    'permissions' => json_encode(['view', 'control', 'manage']),
                ]);
            }
        }

        // Create babysitters
        $babysitters = [
            [
                'email' => 'babysitter@example.com',
                'name' => 'Test Babysitter',
            ],
            [
                'email' => 'babysitter2@example.com',
                'name' => 'Test Babysitter 2',
            ],
        ];

        foreach ($babysitters as $babysitterData) {
            $babysitter = User::firstOrCreate(
                ['email' => $babysitterData['email']],
                [
                    'name' => $babysitterData['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'status' => 'active',
                ]
            );

            // Ensure babysitter has the babysitter role
            if (!$babysitter->hasRole('babysitter')) {
                $babysitter->assignRole('babysitter');
            }
        }
    }
}
