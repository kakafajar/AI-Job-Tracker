<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserProfile;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    /**
     * Menyimpan hasil jawaban pertanyaan onboarding (profiling) sebelum masuk dashboard
     */
    public function save(Request $request)
    {
        $validated = $request->validate([
            'target_role' => 'required|string|max:150',
            'skills' => 'required|array|min:1',
            'location' => 'nullable|string|max:100',
            'work_type' => 'required|string|in:Remote,Hybrid,On-site',
            'job_type' => 'required|string|in:Full-time,Part-time,Internship,Contract',
            'experience_level' => 'required|string|max:50',
            'expected_salary' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500',
        ], [
            'target_role.required' => 'Posisi target pekerjaan wajib diisi.',
            'skills.required' => 'Pilih setidaknya 1 keahlian utama Anda.',
            'skills.min' => 'Pilih setidaknya 1 keahlian utama Anda.',
            'work_type.required' => 'Tipe kerja (Remote/Hybrid/On-site) wajib dipilih.',
            'job_type.required' => 'Jenis pekerjaan wajib dipilih.',
            'experience_level.required' => 'Tingkat pengalaman wajib dipilih.',
        ]);

        $user = $request->user();

        // Cari atau buat profil
        $profile = UserProfile::firstOrNew(['user_id' => $user->id]);
        $profile->target_role = $validated['target_role'];
        $profile->skills = $validated['skills'];
        $profile->location = !empty($validated['location']) ? $validated['location'] : 'Semua Lokasi';
        $profile->work_type = $validated['work_type'];
        $profile->job_type = $validated['job_type'];
        $profile->experience_level = $validated['experience_level'];
        $profile->expected_salary = $validated['expected_salary'] ?? null;
        $profile->bio = $validated['bio'] ?? null;
        $profile->save();

        // Tandai onboarding pengguna telah selesai
        $user->is_onboarded = true;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil dan preferensi berhasil disimpan. Selamat datang di Dashboard!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_onboarded' => true,
                'profile' => $profile,
            ]
        ]);
    }

    /**
     * Upload dan simpan dokumen CV ke database profil pengguna
     */
    public function uploadCv(Request $request)
    {
        $request->validate([
            'cv_file' => 'required|file|mimes:pdf,docx,doc|max:5120',
        ], [
            'cv_file.required' => 'File CV wajib dipilih.',
            'cv_file.mimes' => 'Format file harus berupa PDF atau DOCX.',
            'cv_file.max' => 'Ukuran file maksimal adalah 5 MB.',
        ]);

        $user = $request->user();
        $file = $request->file('cv_file');
        $originalName = $file->getClientOriginalName();
        $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $originalName);

        // Simpan file ke storage public
        $path = $file->storeAs('cv_documents', $fileName, 'public');

        $profile = $user->profile ?: UserProfile::firstOrCreate(['user_id' => $user->id]);
        $profile->cv_path = $originalName;
        $profile->save();

        return response()->json([
            'success' => true,
            'message' => 'Dokumen CV berhasil diunggah.',
            'fileName' => $originalName,
            'filePath' => $path,
            'profile' => $profile,
        ]);
    }
}
