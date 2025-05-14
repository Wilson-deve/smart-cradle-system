<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\Device;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AlertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devices = Device::all();

        $alertTypes = [
            [
                'type' => 'temperature',
                'message' => 'Temperature has exceeded safe limits',
                'severity' => 'warning'
            ],
            [
                'type' => 'humidity',
                'message' => 'Humidity has dropped below recommended levels',
                'severity' => 'info'
            ],
            [
                'type' => 'movement',
                'message' => 'Significant movement detected in the cradle',
                'severity' => 'warning'
            ],
            [
                'type' => 'battery',
                'message' => 'Device battery is below 20%',
                'severity' => 'warning'
            ],
            [
                'type' => 'network',
                'message' => 'Device has lost connection to the network',
                'severity' => 'critical'
            ]
        ];

        foreach ($devices as $device) {
            // Create 2-4 random alerts for each device
            $numAlerts = rand(2, 4);
            for ($i = 0; $i < $numAlerts; $i++) {
                $alertType = $alertTypes[array_rand($alertTypes)];
                $isResolved = (bool)rand(0, 1);
                
                Alert::create([
                    'device_id' => $device->id,
                    'type' => $alertType['type'],
                    'severity' => $alertType['severity'],
                    'message' => $alertType['message'],
                    'status' => $isResolved ? 'resolved' : 'active',
                    'resolved_at' => $isResolved ? Carbon::now()->subMinutes(rand(1, 60)) : null,
                    'created_at' => Carbon::now()->subHours(rand(1, 24))
                ]);
            }
        }
    }
} 