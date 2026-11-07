<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test health check endpoint returns 200 and healthy status when all subsystems are operational.
     */
    public function test_health_check_returns_200_when_healthy(): void
    {
        $responseWeb = $this->getJson('/health');
        $responseWeb->assertStatus(200)
            ->assertJson([
                'status' => 'healthy',
                'services' => [
                    'database' => [
                        'status' => 'healthy',
                    ],
                    'cache' => [
                        'status' => 'healthy',
                    ],
                ],
            ])
            ->assertJsonStructure([
                'status',
                'timestamp',
                'services' => [
                    'database' => ['status', 'connection', 'latency_ms'],
                    'cache' => ['status', 'driver', 'latency_ms'],
                ],
            ]);

        $responseApi = $this->getJson('/api/health');
        $responseApi->assertStatus(200)
            ->assertJson([
                'status' => 'healthy',
            ]);
    }

    /**
     * Test health check endpoint returns 503 when database is disconnected or unavailable.
     */
    public function test_health_check_returns_503_when_database_fails(): void
    {
        $originalDb = config('database.connections.sqlite.database');

        try {
            config(['database.connections.sqlite.database' => '/nonexistent/path/db.sqlite']);
            DB::purge('sqlite');

            $response = $this->getJson('/health');

            $response->assertStatus(503)
                ->assertJson([
                    'status' => 'unhealthy',
                    'services' => [
                        'database' => [
                            'status' => 'unhealthy',
                        ],
                        'cache' => [
                            'status' => 'healthy',
                        ],
                    ],
                ]);
        } finally {
            config(['database.connections.sqlite.database' => $originalDb]);
            DB::purge('sqlite');
        }
    }
}
