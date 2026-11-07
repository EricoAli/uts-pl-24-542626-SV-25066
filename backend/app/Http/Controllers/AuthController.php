<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Handle an authentication attempt and issue a Sanctum token.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            Log::warning('Authentication failed: Invalid credentials', [
                'actor' => 'unauthenticated_client',
                'ip_address' => $request->ip(),
                'action' => 'user_login_attempt',
                'reason' => 'Provided credentials do not match registered records',
            ]);

            return response()->json([
                'message' => 'The provided credentials do not match our records.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        Log::info('User authenticated successfully', [
            'actor' => $user->id,
            'ip_address' => $request->ip(),
            'action' => 'user_login',
            'reason' => 'Valid credentials provided; authentication token issued',
        ]);

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 200);
    }

    /**
     * Log the authenticated user out (revoke current token).
     */
    public function logout(Request $request): JsonResponse
    {
        $userId = $request->user()?->id;
        $request->user()->currentAccessToken()->delete();

        Log::info('User logged out successfully', [
            'actor' => $userId,
            'ip_address' => $request->ip(),
            'action' => 'user_logout',
            'reason' => 'User revoked current access token',
        ]);

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }
}
