<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sku' => 'PRD-' . strtoupper(fake()->bothify('??###')),
            'name' => fake()->words(2, true),
            'category' => fake()->randomElement(['Makanan', 'Minuman', 'Snack', 'ATK']),
            'price' => fake()->numberBetween(5000, 100000),
            'stock' => fake()->numberBetween(0, 100),
        ];
    }
}
