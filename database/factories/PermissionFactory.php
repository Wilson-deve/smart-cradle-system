<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Permission>
 */
class PermissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $group = ['user_management', 'device_control', 'monitoring', 'notifications'];
        $actions = ['create', 'read', 'update', 'delete', 'manage'];

        return [
            'name' => $this->faker->unique()->randomElement($actions) . '-' . $this->faker->randomElement(['user', 'devices', 'babies']),
            'group' => $this->faker->randomElement($group),
            'display_name' => $this->faker->words(2, true),
            'description' => $this->faker->sentence(),
        ];
    }
}
