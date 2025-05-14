<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement(['admin','parent','babysitter']),
            'label' => fn (array $attributes) => ucfirst($attributes['name']),
            'description' => $this->faker->sentence(),
            'is_default' => $this->faker->boolean(20),
        ];
    }
}
