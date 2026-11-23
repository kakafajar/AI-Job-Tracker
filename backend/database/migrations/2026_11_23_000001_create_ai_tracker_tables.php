<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tambah api_token dan is_onboarded ke users jika belum ada
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'api_token')) {
                $table->string('api_token', 80)->unique()->nullable()->after('password');
            }
            if (!Schema::hasColumn('users', 'is_onboarded')) {
                $table->boolean('is_onboarded')->default(false)->after('api_token');
            }
        });

        // 2. Tabel Profil Pengguna (User Profiles)
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('target_role')->nullable();
            $table->string('location')->nullable();
            $table->string('work_type')->nullable(); // Remote, Hybrid, On-site
            $table->string('job_type')->nullable();  // Full-time, Part-time, Internship, Contract
            $table->string('experience_level')->nullable(); // Fresh Graduate, Junior, Mid, Senior
            $table->string('expected_salary')->nullable();
            $table->json('skills')->nullable();
            $table->text('bio')->nullable();
            $table->string('cv_path')->nullable();
            $table->timestamps();
        });

        // 3. Tabel Lowongan Pekerjaan (Job Listings)
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('company');
            $table->string('location');
            $table->string('work_type')->default('Remote'); // Remote, Hybrid, On-site
            $table->string('job_type')->default('Full-time');
            $table->string('salary_range')->nullable();
            $table->text('description')->nullable();
            $table->json('requirements')->nullable(); // array of required skills
            $table->string('source')->default('Tech in Asia Jobs');
            $table->string('source_url')->nullable();
            $table->string('posted_date')->nullable();
            $table->timestamps();
        });

        // 4. Tabel Pelacak Lamaran (Tracked Jobs)
        Schema::create('tracked_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_listing_id')->nullable()->constrained('job_listings')->nullOnDelete();
            $table->string('title');
            $table->string('company');
            $table->string('location')->default('Indonesia');
            $table->string('work_type')->default('Remote');
            $table->string('job_type')->default('Full-time');
            $table->string('salary_range')->nullable();
            $table->string('status')->default('Disimpan'); // Disimpan, Sudah Melamar, Wawancara, Diterima, Ditolak
            $table->integer('match_score')->default(85);
            $table->text('match_reason')->nullable();
            $table->json('matched_skills')->nullable();
            $table->string('source')->default('AI Recommendation');
            $table->string('source_url')->nullable();
            $table->string('posted_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracked_jobs');
        Schema::dropIfExists('job_listings');
        Schema::dropIfExists('user_profiles');

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'api_token')) {
                $table->dropColumn('api_token');
            }
            if (Schema::hasColumn('users', 'is_onboarded')) {
                $table->dropColumn('is_onboarded');
            }
        });
    }
};
