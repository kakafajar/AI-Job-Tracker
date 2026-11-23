<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Registrasi pengguna baru
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal terdiri dari 6 karakter.',
        ]);

        $token = Str::random(60);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'api_token' => $token,
            'is_onboarded' => false,
        ]);

        // Buat profil kosong untuk user baru
        $profile = UserProfile::create([
            'user_id' => $user->id,
            'target_role' => null,
            'location' => 'Indonesia',
            'work_type' => 'Remote',
            'job_type' => 'Full-time',
            'experience_level' => 'Junior',
            'skills' => [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil! Silakan lengkapi profil Anda.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_onboarded' => false,
                'profile' => $profile,
            ]
        ], 201);
    }

    /**
     * Login pengguna
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password yang Anda masukkan salah.'
            ], 401);
        }

        // Perbarui token sesi
        $token = Str::random(60);
        $user->api_token = $token;
        $user->save();

        $profile = $user->profile ?: UserProfile::firstOrCreate([
            'user_id' => $user->id,
        ], [
            'location' => 'Indonesia',
            'work_type' => 'Remote',
            'job_type' => 'Full-time',
            'experience_level' => 'Junior',
            'skills' => [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_onboarded' => (bool) $user->is_onboarded,
                'profile' => $profile,
            ]
        ]);
    }

    /**
     * Mengambil profil data user yang sedang login
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('profile');

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_onboarded' => (bool) $user->is_onboarded,
                'profile' => $user->profile,
            ]
        ]);
    }

    /**
     * Logout pengguna
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->api_token = null;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil keluar dari akun.'
        ]);
    }
}
