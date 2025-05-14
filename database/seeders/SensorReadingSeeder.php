<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\SensorReading;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SensorReadingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devices = Device::all();
        $sensorTypes = [
            [
                'type' => 'temperature',
                'min' => 20,
                'max' => 25,
                'decimals' => 1,
                'unit' => 'celsius'
            ],
            [
                'type' => 'humidity',
                'min' => 40,
                'max' => 60,
                'decimals' => 0,
                'unit' => 'percentage'
            ],
            [
                'type' => 'noise',
                'min' => 30,
                'max' => 70,
                'decimals' => 0,
                'unit' => 'decibel'
            ],
            [
                'type' => 'light',
                'min' => 0,
                'max' => 100,
                'decimals' => 0,
                'unit' => 'percentage'
            ],
            [
                'type' => 'movement',
                'min' => 0,
                'max' => 1,
                'decimals' => 0,
                'unit' => 'boolean'
            ],
            [
                'type' => 'wetness',
                'min' => 0,
                'max' => 1,
                'decimals' => 0,
                'unit' => 'boolean'
            ],
            [
                'type' => 'battery',
                'min' => 20,
                'max' => 100,
                'decimals' => 0,
                'unit' => 'percentage'
            ]
        ];

        foreach ($devices as $device) {
            // Create 24 hours of sensor readings for each type
            for ($hour = 0; $hour < 24; $hour++) {
                foreach ($sensorTypes as $sensor) {
                    $value = $sensor['decimals'] > 0
                        ? round(rand($sensor['min'] * 10, $sensor['max'] * 10) / 10, $sensor['decimals'])
                        : rand($sensor['min'], $sensor['max']);

                    SensorReading::create([
                        'device_id' => $device->id,
                        'type' => $sensor['type'],
                        'value' => $value,
                        'unit' => $sensor['unit'],
                        'recorded_at' => Carbon::now()->subHours($hour),
                    ]);
                }
            }
        }
    }
} 