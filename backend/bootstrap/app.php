<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(fn (Request $request) => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->report(function (\PDOException $e) {
            $request = request();
            Log::error('Database connection error encountered', [
                'actor' => $request ? ($request->user()?->id ?? 'guest') : 'system',
                'ip_address' => $request ? $request->ip() : '127.0.0.1',
                'action' => $request ? ($request->method() . ' ' . $request->path()) : 'console_background',
                'target' => 'database',
                'reason' => 'Database operation failed due to connection error: ' . $e->getMessage(),
            ]);
        });
    })->create();
