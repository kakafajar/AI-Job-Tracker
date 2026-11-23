<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Middleware\AuthenticateApi;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - AI Job Tracker & CV Analyzer
|--------------------------------------------------------------------------
*/

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Harus Menyertakan Header 'Authorization: Bearer <token>')
Route::middleware(AuthenticateApi::class)->group(function () {
    // Info User Aktif & Logout
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Onboarding (Pertanyaan Profil Pra-Dashboard)
    Route::post('/onboarding', [OnboardingController::class, 'save']);
    Route::post('/profile/cv', [OnboardingController::class, 'uploadCv']);

    // Rekomendasi Lowongan & Sinkronisasi DB
    Route::get('/jobs/recommendations', [JobController::class, 'getRecommendations']);

    // Job Tracker
    Route::get('/tracker/jobs', [JobController::class, 'getTrackedJobs']);
    Route::post('/tracker/jobs', [JobController::class, 'saveTrackedJob']);
    Route::put('/tracker/jobs/{id}/status', [JobController::class, 'updateTrackedStatus']);
    Route::delete('/tracker/jobs/{id}', [JobController::class, 'deleteTrackedJob']);
});
