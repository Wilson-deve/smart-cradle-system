<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devices = Device::factory(3)->create();

        $parents = User::all()->filter(function ($user) {
            return $user->hasRole('parent');
        });

        $devices->each(function ($device) use ($parents) {
            $parent = $parents->random();

            $device->users()->attach($parent, [
                'relationship_type' => 'owner',
                'permissions' => json_encode(['view', 'control', 'manage']),
            ]);

            if (rand(0,1)) {
                $babysitter = User::all()->filter(function ($user) {
                    return $user->hasRole('babysitter');
                })->random();

                if ($babysitter) {
                    $device->users()->attach($babysitter, [
                        'relationship_type' => 'caretaker',
                        'permissions' => json_encode(['view', 'control_limited']),
                    ]);
                }
            }
        });
    }
}
