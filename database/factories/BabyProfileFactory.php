<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BabyProfile>
 */
class BabyProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
            'birth_date' => $this->faker->dateTimeBetween('-2 years', '-1 year'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'birth_weight' => $this->faker->randomFloat(2,2.5,4.5),
            'birth_height' => $this->faker->numberBetween(45, 55),
            'medical_notes' => $this->faker->optional()->paragraph(),
            'photo_path' => $this->faker->optional()->imageUrl(200, 200, 'baby'),
        ];
    }
}
