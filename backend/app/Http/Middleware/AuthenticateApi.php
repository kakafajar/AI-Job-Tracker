<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApi
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token autentikasi tidak ditemukan. Silakan login kembali.'
            ], 401);
        }

        $user = User::where('api_token', $token)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali.'
            ], 401);
        }

        // Set authenticated user on request
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}
