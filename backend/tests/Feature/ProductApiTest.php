<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test accessing product endpoints without token returns 401 Unauthorized.
     */
    public function test_unauthenticated_user_cannot_access_products(): void
    {
        $responseGetJson = $this->getJson('/api/products');
        $responseGetJson->assertStatus(401);

        $responseGetPlain = $this->get('/api/products');
        $responseGetPlain->assertStatus(401);

        $responsePost = $this->postJson('/api/products', [
            'sku' => 'SKU-001',
            'name' => 'Kopi Susu',
            'category' => 'Minuman',
            'price' => 15000,
            'stock' => 10,
        ]);
        $responsePost->assertStatus(401);
    }

    /**
     * Test login and successfully create product with status 201 Created.
     */
    public function test_login_and_successfully_create_product(): void
    {
        $this->seed(DatabaseSeeder::class);

        // 1. Login with seeded admin credentials
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'admin@pos.com',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200);
        $token = $loginResponse->json('access_token');
        $this->assertNotEmpty($token);

        // 2. Create product using the access token
        $productPayload = [
            'sku' => 'POS-CF-001',
            'name' => 'Kopi Espresso Blend',
            'category' => 'Minuman',
            'price' => 22000,
            'stock' => 50,
        ];

        $createResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/products', $productPayload);

        $createResponse->assertStatus(201)
            ->assertJson([
                'message' => 'Product created successfully',
                'data' => [
                    'sku' => 'POS-CF-001',
                    'name' => 'Kopi Espresso Blend',
                    'category' => 'Minuman',
                    'price' => '22000.00',
                    'stock' => 50,
                ],
            ]);

        $this->assertDatabaseHas('products', [
            'sku' => 'POS-CF-001',
            'name' => 'Kopi Espresso Blend',
        ]);
    }

    /**
     * Test product creation fails with 422 Unprocessable Entity when validation fails.
     */
    public function test_create_product_validation_failure_returns_422(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Test missing all required fields
        $responseEmpty = $this->postJson('/api/products', []);
        $responseEmpty->assertStatus(422)
            ->assertJsonValidationErrors(['sku', 'name', 'category', 'price', 'stock']);

        // Test duplicate SKU
        Product::factory()->create(['sku' => 'SKU-UNIQUE-001']);

        $responseDuplicate = $this->postJson('/api/products', [
            'sku' => 'SKU-UNIQUE-001',
            'name' => 'Produk Lain',
            'category' => 'Snack',
            'price' => 10000,
            'stock' => 5,
        ]);

        $responseDuplicate->assertStatus(422)
            ->assertJsonValidationErrors(['sku']);
    }

    /**
     * Test authenticated user can retrieve list of products.
     */
    public function test_authenticated_user_can_list_products(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Product::factory()->count(3)->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    '*' => ['id', 'sku', 'name', 'category', 'price', 'stock', 'created_at', 'updated_at'],
                ],
            ]);

        $this->assertCount(3, $response->json('data'));
    }

    /**
     * Test authenticated user can view single product.
     */
    public function test_authenticated_user_can_show_product(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $product = Product::factory()->create([
            'sku' => 'SKU-SHOW-01',
            'name' => 'Roti Bakar Cokelat',
        ]);

        $response = $this->getJson('/api/products/' . $product->id);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Product retrieved successfully',
                'data' => [
                    'id' => $product->id,
                    'sku' => 'SKU-SHOW-01',
                    'name' => 'Roti Bakar Cokelat',
                ],
            ]);
    }

    /**
     * Test accessing non-existent product returns 404 Not Found.
     */
    public function test_show_non_existent_product_returns_404(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/products/999999');

        $response->assertStatus(404);
    }

    /**
     * Test authenticated user can update product.
     */
    public function test_authenticated_user_can_update_product(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $product = Product::factory()->create([
            'sku' => 'SKU-UPDATE-01',
            'name' => 'Teh Manis Dingin',
            'price' => 5000,
            'stock' => 20,
        ]);

        $response = $this->putJson('/api/products/' . $product->id, [
            'name' => 'Teh Manis Hangat',
            'price' => 4500,
            'stock' => 25,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Product updated successfully',
                'data' => [
                    'name' => 'Teh Manis Hangat',
                    'price' => '4500.00',
                    'stock' => 25,
                ],
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Teh Manis Hangat',
        ]);
    }

    /**
     * Test authenticated user can delete product.
     */
    public function test_authenticated_user_can_delete_product(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $product = Product::factory()->create();

        $response = $this->deleteJson('/api/products/' . $product->id);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Product deleted successfully',
            ]);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }
}
