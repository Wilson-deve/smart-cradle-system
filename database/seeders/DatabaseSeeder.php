<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Device;
use App\Models\SensorReading;
use App\Models\MaintenanceRecord;
use App\Models\DeviceLog;
use App\Models\SystemLog;
use App\Models\Alert;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // Admin permissions
            ['name' => 'Manage Users', 'slug' => 'user.view', 'description' => 'View system users'],
            ['name' => 'Create Users', 'slug' => 'user.create', 'description' => 'Create new users'],
            ['name' => 'Update Users', 'slug' => 'user.update', 'description' => 'Update existing users'],
            ['name' => 'Delete Users', 'slug' => 'user.delete', 'description' => 'Delete users'],
            ['name' => 'Manage Devices', 'slug' => 'device.view', 'description' => 'View all devices'],
            ['name' => 'Create Devices', 'slug' => 'device.create', 'description' => 'Create new devices'],
            ['name' => 'Update Devices', 'slug' => 'device.update', 'description' => 'Update devices'],
            ['name' => 'Delete Devices', 'slug' => 'device.delete', 'description' => 'Delete devices'],
            ['name' => 'Control Devices', 'slug' => 'device.control', 'description' => 'Control devices'],
            ['name' => 'Monitor Devices', 'slug' => 'device.monitor', 'description' => 'Monitor devices'],
            ['name' => 'View Device Health', 'slug' => 'device.health', 'description' => 'View device health'],
            ['name' => 'View Monitoring', 'slug' => 'monitoring.view', 'description' => 'View monitoring dashboard'],
            ['name' => 'Control Monitoring', 'slug' => 'monitoring.control', 'description' => 'Control monitoring features'],
            ['name' => 'Manage Alerts', 'slug' => 'monitoring.alerts', 'description' => 'View and manage alerts'],
            ['name' => 'View Alerts', 'slug' => 'alerts.view', 'description' => 'View alerts'],
            ['name' => 'Update Alerts', 'slug' => 'alerts.update', 'description' => 'Update alerts'],
            ['name' => 'Manage Settings', 'slug' => 'system.settings', 'description' => 'Manage system settings'],
            ['name' => 'View System Logs', 'slug' => 'system.logs', 'description' => 'View system logs'],
            ['name' => 'Manage Backups', 'slug' => 'system.backup', 'description' => 'Manage system backups'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            DeviceSeeder::class,
            SensorReadingSeeder::class,
            AlertSeeder::class,
            RolePermissionSeeder::class,
        ]);

        // Get roles for user assignment
        $adminRole = Role::where('slug', 'admin')->first();
        $parentRole = Role::where('slug', 'parent')->first();
        $babysitterRole = Role::where('slug', 'babysitter')->first();

        // Create users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'status' => 'active',
        ]);
        $admin->roles()->attach($adminRole);

        $parent = User::create([
            'name' => 'Parent User',
            'email' => 'parent@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'status' => 'active',
        ]);
        $parent->roles()->attach($parentRole);

        $babysitter = User::create([
            'name' => 'Babysitter User',
            'email' => 'babysitter@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'status' => 'active',
        ]);
        $babysitter->roles()->attach($babysitterRole);

        // Create devices
        $devices = [];
        for ($i = 1; $i <= 5; $i++) {
            $device = Device::create([
                'name' => "Smart Cradle {$i}",
                'serial_number' => "SC" . str_pad($i, 4, '0', STR_PAD_LEFT) . random_int(1000, 9999),
                'mac_address' => implode(':', array_map(function() {
                    return str_pad(dechex(mt_rand(0, 255)), 2, '0', STR_PAD_LEFT);
                }, range(1, 6))),
                'ip_address' => '192.168.1.' . (100 + $i),
                'status' => ['online', 'offline', 'maintenance'][rand(0, 2)],
                'settings' => [
                    'swing' => [
                        'enabled' => (bool)rand(0, 1),
                        'speed' => rand(1, 5)
                    ],
                    'music' => [
                        'enabled' => (bool)rand(0, 1),
                        'volume' => rand(0, 100),
                        'track_id' => rand(1, 5)
                    ],
                    'projector' => [
                        'enabled' => (bool)rand(0, 1),
                        'brightness' => rand(10, 100),
                        'pattern' => ['stars', 'ocean', 'forest', 'rainbow', 'animals'][rand(0, 4)]
                    ],
                    'camera' => [
                        'stream_url' => "rtsp://smartcradle.local/device{$i}/stream",
                        'status' => ['online', 'offline'][rand(0, 1)],
                        'night_vision' => (bool)rand(0, 1)
                    ]
                ],
                'battery_level' => rand(20, 100),
                'signal_strength' => rand(40, 100),
                'last_maintenance_at' => Carbon::now()->subDays(rand(1, 30)),
                'next_maintenance_at' => Carbon::now()->addDays(rand(1, 30)),
                'last_activity_at' => Carbon::now()->subMinutes(rand(0, 60))
            ]);

            // Assign users to devices
            $device->users()->attach($parent->id, [
                'relationship_type' => 'owner',
                'permissions' => json_encode(['view', 'control', 'manage'])
            ]);

            if (rand(0, 1)) {
                $device->users()->attach($babysitter->id, [
                    'relationship_type' => 'caretaker',
                    'permissions' => json_encode(['view', 'control_limited'])
                ]);
            }

            $devices[] = $device;
        }

        // Create maintenance records
        foreach ($devices as $device) {
            for ($i = 0; $i < 3; $i++) {
                MaintenanceRecord::create([
                    'device_id' => $device->id,
                    'type' => ['routine', 'repair', 'upgrade'][rand(0, 2)],
                    'description' => "Maintenance activity {$i}",
                    'performed_at' => Carbon::now()->subDays(rand(1, 30)),
                    'next_maintenance_due' => Carbon::now()->addDays(rand(1, 30)),
                ]);
            }
        }

        // Create device logs
        foreach ($devices as $device) {
            $actions = ['swing_control', 'music_control', 'projector_control'];
            foreach ($actions as $action) {
                for ($i = 0; $i < 5; $i++) {
                    DeviceLog::create([
                        'device_id' => $device->id,
                        'action' => $action,
                        'duration' => rand(10, 60),
                        'data' => json_encode(['status' => ['enabled' => rand(0, 1)]]),
                        'created_at' => Carbon::now()->subHours(rand(1, 24)),
                    ]);
                }
            }
        }

        // Create system logs
        for ($i = 0; $i < 50; $i++) {
            SystemLog::create([
                'device_id' => rand(1, 5),
                'user_id' => rand(1, 3),
                'log_type' => ['info', 'warning', 'error'][rand(0, 2)],
                'action' => "System action {$i}",
                'data' => json_encode(['details' => "System log message {$i}"]),
            ]);
        }
    }
}
