<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\TrackedJob;
use Illuminate\Http\Request;

class JobController extends Controller
{
    /**
     * Mengambil rekomendasi lowongan yang disinkronkan dengan profil pengguna
     */
    public function getRecommendations(Request $request)
    {
        $user = $request->user()->load('profile');
        $profile = $user->profile;

        // Pastikan ada data lowongan di database (auto-seed jika kosong)
        $this->ensureSeedJobs();

        $query = JobListing::query();

        // Filter lokasi jika ada parameter dari frontend
        if ($request->filled('location') && $request->location !== 'Semua Lokasi') {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Filter tipe kerja
        if ($request->filled('workType') && $request->workType !== 'All') {
            $query->where('work_type', $request->workType);
        }

        $jobs = $query->get();

        // Hitung skor kecocokan berdasarkan target_role & skill pengguna
        $userRole = strtolower($profile->target_role ?? '');
        $userSkills = array_map('strtolower', (array) ($profile->skills ?? []));

        $scoredJobs = $jobs->map(function ($job) use ($userRole, $userSkills) {
            $score = 75; // Base match score
            $jobTitle = strtolower($job->title);
            $jobReqs = array_map('strtolower', (array) ($job->requirements ?? []));

            // Jika kata kunci role cocok
            if (!empty($userRole) && (str_contains($jobTitle, $userRole) || str_contains($userRole, $jobTitle))) {
                $score += 15;
            }

            // Hitung kecocokan skill
            $matchedSkills = [];
            foreach ($job->requirements ?? [] as $skill) {
                if (in_array(strtolower($skill), $userSkills)) {
                    $matchedSkills[] = $skill;
                    $score += 4;
                }
            }

            // Cap maksimal 98%
            $score = min($score, 98);

            return [
                'id' => (string) $job->id,
                'isDemo' => false,
                'title' => $job->title,
                'company' => $job->company,
                'location' => $job->location,
                'workType' => $job->work_type,
                'jobType' => $job->job_type,
                'salaryRange' => $job->salary_range,
                'matchScore' => $score,
                'matchReason' => count($matchedSkills) > 0
                    ? 'Kecocokan kuat dengan keahlian: ' . implode(', ', array_slice($matchedSkills, 0, 3))
                    : 'Relevan dengan preferensi bidang dan tipe kerja yang Anda tentukan.',
                'matchedSkills' => !empty($matchedSkills) ? $matchedSkills : ($job->requirements ?? []),
                'source' => $job->source,
                'sourceUrl' => $job->source_url ?? 'https://www.techinasia.com/jobs',
                'postedDate' => $job->posted_date ?? 'Baru saja',
            ];
        });

        // Urutkan berdasarkan skor tertinggi
        $sortBy = $request->get('sortBy', 'score-desc');
        if ($sortBy === 'score-desc') {
            $scoredJobs = $scoredJobs->sortByDesc('matchScore')->values();
        } else {
            $scoredJobs = $scoredJobs->sortBy('matchScore')->values();
        }

        return response()->json([
            'success' => true,
            'total' => $scoredJobs->count(),
            'jobs' => $scoredJobs,
        ]);
    }

    /**
     * Mengambil daftar lowongan yang dilacak oleh user
     */
    public function getTrackedJobs(Request $request)
    {
        $user = $request->user();
        $tracked = TrackedJob::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'jobs' => $tracked->map(function ($item) {
                return [
                    'id' => (string) $item->id,
                    'isDemo' => false,
                    'title' => $item->title,
                    'company' => $item->company,
                    'location' => $item->location,
                    'workType' => $item->work_type,
                    'jobType' => $item->job_type,
                    'salaryRange' => $item->salary_range,
                    'status' => $item->status,
                    'matchScore' => $item->match_score,
                    'matchReason' => $item->match_reason,
                    'matchedSkills' => $item->matched_skills ?? [],
                    'source' => $item->source,
                    'sourceUrl' => $item->source_url,
                    'postedDate' => $item->posted_date,
                    'notes' => $item->notes,
                ];
            }),
        ]);
    }

    /**
     * Menyimpan lowongan ke tracker
     */
    public function saveTrackedJob(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'company' => 'required|string',
            'location' => 'nullable|string',
            'workType' => 'nullable|string',
            'jobType' => 'nullable|string',
            'salaryRange' => 'nullable|string',
            'status' => 'nullable|string',
            'matchScore' => 'nullable|integer',
            'matchReason' => 'nullable|string',
            'matchedSkills' => 'nullable|array',
            'source' => 'nullable|string',
            'sourceUrl' => 'nullable|string',
        ]);

        $user = $request->user();

        $tracked = TrackedJob::updateOrCreate(
            [
                'user_id' => $user->id,
                'title' => $validated['title'],
                'company' => $validated['company'],
            ],
            [
                'location' => $validated['location'] ?? 'Indonesia',
                'work_type' => $validated['workType'] ?? 'Remote',
                'job_type' => $validated['jobType'] ?? 'Full-time',
                'salary_range' => $validated['salaryRange'] ?? null,
                'status' => $validated['status'] ?? 'Disimpan',
                'match_score' => $validated['matchScore'] ?? 85,
                'match_reason' => $validated['matchReason'] ?? null,
                'matched_skills' => $validated['matchedSkills'] ?? [],
                'source' => $validated['source'] ?? 'AI Recommendation',
                'source_url' => $validated['sourceUrl'] ?? '#',
                'posted_date' => 'Baru saja',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Lowongan berhasil disimpan ke Job Tracker.',
            'job' => $tracked,
        ]);
    }

    /**
     * Memperbarui status lowongan di tracker
     */
    public function updateTrackedStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Disimpan,Sudah Melamar,Wawancara,Diterima,Ditolak',
        ]);

        $user = $request->user();
        $tracked = TrackedJob::where('user_id', $user->id)->where('id', $id)->first();

        if (!$tracked) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }

        $tracked->status = $validated['status'];
        $tracked->save();

        return response()->json([
            'success' => true,
            'message' => 'Status lamaran berhasil diperbarui.',
            'job' => $tracked,
        ]);
    }

    /**
     * Menghapus lowongan dari tracker
     */
    public function deleteTrackedJob(Request $request, $id)
    {
        $user = $request->user();
        TrackedJob::where('user_id', $user->id)->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lowongan dihapus dari Job Tracker.',
        ]);
    }

    /**
     * Helper untuk memastikan database memiliki daftar lowongan awal
     */
    private function ensureSeedJobs()
    {
        if (JobListing::count() > 0) {
            return;
        }

        $initialJobs = [
            [
                'title' => 'Frontend React Developer',
                'company' => 'Nusantara Digital Solusindo',
                'location' => 'Jakarta',
                'work_type' => 'Remote',
                'job_type' => 'Full-time',
                'salary_range' => 'Rp 9.000.000 - Rp 14.000.000',
                'description' => 'Membangun aplikasi frontend berbasis React dan Tailwind CSS.',
                'requirements' => ['React', 'JavaScript', 'Tailwind CSS', 'REST API', 'Git'],
                'source' => 'Tech in Asia Jobs',
                'source_url' => 'https://www.techinasia.com/jobs',
                'posted_date' => '2 hari lalu',
            ],
            [
                'title' => 'Junior Fullstack Engineer (Laravel & React)',
                'company' => 'Aksara Karya Mediatama',
                'location' => 'Bandung',
                'work_type' => 'Hybrid',
                'job_type' => 'Full-time',
                'salary_range' => 'Rp 8.000.000 - Rp 12.000.000',
                'description' => 'Mengembangkan API backend Laravel serta antarmuka SPA menggunakan React.',
                'requirements' => ['PHP', 'Laravel', 'React', 'MySQL', 'REST API'],
                'source' => 'Glints Indonesia',
                'source_url' => 'https://glints.com/id',
                'posted_date' => '3 hari lalu',
            ],
            [
                'title' => 'UI/UX Designer & Product Researcher',
                'company' => 'Karsa Kreasi Digital',
                'location' => 'Jakarta',
                'work_type' => 'Remote',
                'job_type' => 'Full-time',
                'salary_range' => 'Rp 8.500.000 - Rp 13.000.000',
                'description' => 'Merancang alur wireframe, prototipe Figma, dan usability testing produk.',
                'requirements' => ['Figma', 'UI/UX', 'Design System', 'Prototyping', 'User Research'],
                'source' => 'LinkedIn Jobs',
                'source_url' => 'https://linkedin.com/jobs',
                'posted_date' => '1 hari lalu',
            ],
            [
                'title' => 'Backend Laravel Developer',
                'company' => 'Bhinneka Solusi Teknologi',
                'location' => 'Surabaya',
                'work_type' => 'Remote',
                'job_type' => 'Full-time',
                'salary_range' => 'Rp 9.000.000 - Rp 15.000.000',
                'description' => 'Optimalisasi database MySQL dan pembuatan RESTful API arsitektur modular.',
                'requirements' => ['PHP', 'Laravel', 'MySQL', 'Redis', 'Docker'],
                'source' => 'JobStreet Indonesia',
                'source_url' => 'https://jobstreet.co.id',
                'posted_date' => '4 hari lalu',
            ],
            [
                'title' => 'Frontend Web Developer',
                'company' => 'Sinergi Mega Persada',
                'location' => 'Yogyakarta',
                'work_type' => 'Hybrid',
                'job_type' => 'Full-time',
                'salary_range' => 'Rp 7.000.000 - Rp 10.500.000',
                'description' => 'Pengembangan portal interaktif menggunakan React dan Vite.',
                'requirements' => ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vite'],
                'source' => 'Glints Indonesia',
                'source_url' => 'https://glints.com/id',
                'posted_date' => '5 hari lalu',
            ],
            [
                'title' => 'Junior Web Programmer',
                'company' => 'Inovasi Teknologi Cipta',
                'location' => 'Semarang',
                'work_type' => 'On-site',
                'job_type' => 'Full-time',
                'salary_range' => 'Rp 6.000.000 - Rp 8.500.000',
                'description' => 'Membantu maintenance website dan modul back-office internal.',
                'requirements' => ['PHP', 'JavaScript', 'MySQL', 'Bootstrap', 'Git'],
                'source' => 'Tech in Asia Jobs',
                'source_url' => 'https://www.techinasia.com/jobs',
                'posted_date' => '1 minggu lalu',
            ]
        ];

        foreach ($initialJobs as $job) {
            JobListing::create($job);
        }
    }
}
