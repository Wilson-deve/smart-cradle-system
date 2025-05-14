<?php

namespace Database\Factories;

use App\Models\Device;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Device>
 */
class DeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     protected $model = Device::class;
     
    public function definition(): array
    {
        return [
            'name' => $this->faker->word().' Cradle',
            'serial_number' => 'CRDL-'.$this->faker->unique()->bothify('####-????-####'),
            'mac_address' => $this->faker->unique()->macAddress(),
            'ip_address' => $this->faker->localIpv4(),
            'status' => $this->faker->randomElement(['online', 'offline', 'maintenance']),
            'settings' => [
                'swing_speed' => $this->faker->numberBetween(1, 5),
                'lullabies' => $this->faker->randomElement(['Twinkle Twinkle', 'Rock-a-bye Baby', 'Brahms\' Lullaby'], 2),
                'light_intensity' => $this->faker->numberBetween(10, 100),
            ],
            'last_activity_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ];
    }
}
