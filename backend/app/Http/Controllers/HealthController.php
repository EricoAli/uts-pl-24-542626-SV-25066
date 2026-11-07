<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HealthController extends Controller
{
    /**
     * Perform health checks on Database and Cache subsystems.
     * Returns HTTP 200 when healthy, or HTTP 503 when any subsystem is unhealthy.
     */
    public function check(Request $request): JsonResponse
    {
        $services = [];
        $isHealthy = true;

        // 1. Inspect Database Connectivity
        try {
            $dbStart = microtime(true);
            DB::connection()->getPdo();
            DB::select('SELECT 1');
            $dbLatencyMs = round((microtime(true) - $dbStart) * 1000, 2);

            $services['database'] = [
                'status' => 'healthy',
                'connection' => config('database.default'),
                'latency_ms' => $dbLatencyMs,
            ];
        } catch (\Throwable $e) {
            $isHealthy = false;
            $services['database'] = [
                'status' => 'unhealthy',
                'connection' => config('database.default'),
                'error' => $e->getMessage(),
            ];

            Log::error('Healthcheck: Database connection failure', [
                'actor' => 'system_healthcheck',
                'ip_address' => $request->ip(),
                'action' => 'database_connectivity_check',
                'target' => 'database',
                'reason' => 'Unable to establish connection to database: ' . $e->getMessage(),
            ]);
        }

        // 2. Inspect Cache Subsystem
        try {
            $cacheStart = microtime(true);
            $probeKey = '_healthcheck_probe_' . bin2hex(random_bytes(4));
            $probeVal = 'probe_ok';

            Cache::put($probeKey, $probeVal, 10);
            $retrievedVal = Cache::get($probeKey);
            Cache::forget($probeKey);

            if ($retrievedVal !== $probeVal) {
                throw new \RuntimeException('Cache probe verification failed');
            }

            $cacheLatencyMs = round((microtime(true) - $cacheStart) * 1000, 2);
            $services['cache'] = [
                'status' => 'healthy',
                'driver' => config('cache.default'),
                'latency_ms' => $cacheLatencyMs,
            ];
        } catch (\Throwable $e) {
            $isHealthy = false;
            $services['cache'] = [
                'status' => 'unhealthy',
                'driver' => config('cache.default'),
                'error' => $e->getMessage(),
            ];

            Log::error('Healthcheck: Cache operation failure', [
                'actor' => 'system_healthcheck',
                'ip_address' => $request->ip(),
                'action' => 'cache_connectivity_check',
                'target' => 'cache',
                'reason' => 'Cache probe read/write test failed: ' . $e->getMessage(),
            ]);
        }

        $statusCode = $isHealthy ? 200 : 503;

        return response()->json([
            'status' => $isHealthy ? 'healthy' : 'unhealthy',
            'timestamp' => now()->toIso8601String(),
            'services' => $services,
        ], $statusCode);
    }
}
